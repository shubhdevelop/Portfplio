---
title: "Network Protocols for Dummies: Framing, Messages and State Machines"
date: "2026-11-22"
description: "A practical guide to TCP framing, partial reads and writes, wire formats, protocol messages, and state machines, using C code and the SOCKS4/SOCKS4a and WebSocket protocols as examples."
tags: ["Networking", "C", "Systems Programming"]
author: "Shubham Raj"
---

Recently, I implemented the **SOCKS4** and **SOCKS4a** protocols in C and learned some general ideas around network frame parsing and message handling.

This is not a definitive guide to implementing any specific network protocol. This blog talks about protocols in general intentionally, though it takes a specific protocol as an example to pass the message effectively, as most protocols have several ideas that overlap with each other.

This post focuses on TCP protocols because TCP does much of the heavy lifting that an application would otherwise have to do.

For example, **QUIC** runs over **UDP** and implements reliable delivery, ordering within streams, loss recovery, congestion control, and encryption in user space. TCP provides an ordered, reliable byte stream to the application while the connection remains usable.

As we implement a protocol, there are a few things we need to keep in mind before jumping into the code. They are as follows:

### Bytes sent over the network are buffered

When we write bytes over the network from the application layer, the OS normally copies the data from the application's buffer into the **kernel socket's send buffer**. The TCP stack transmits those bytes when network and flow-control conditions allow it.

TCP can delay small writes when there are already unacknowledged bytes in flight. This behavior is commonly associated with **Nagle's algorithm**. The stack can wait until either:

- Enough bytes accumulate to fill a TCP segment.
- The peer acknowledges previously transmitted data.

Applications can disable this delay with `TCP_NODELAY` when low latency is more important than sending fewer packets.

The core of TCP's reliability is its **acknowledgement (ACK)** mechanism, which affects **backpressure** on the sender. When `send()` returns `N`, it means the local kernel accepted `N` bytes from the application. It does **not** mean that the peer application received or processed those bytes.

If the peer application stops reading, its receive buffer can fill. The peer then advertises a smaller receive window, eventually possibly zero. The local send buffer can also fill. That is when blocking `send()` calls can block. Non-blocking `send()` calls can return `EAGAIN` or `EWOULDBLOCK`.

TCP treats the send buffer as a **continuous, unstructured stream of bytes** with no message boundaries. Because `send()` can perform **partial writes** when buffer space is low, we cannot blindly interleave two different logical messages from multiple threads on the same socket.

### Bytes received from the network are buffered

When we call `recv()`, the OS copies bytes from the kernel socket receive buffer into the application buffer.
For a blocking socket, `recv()` waits until at least one byte is available, the peer closes its send direction, or an error occurs. It can return fewer bytes than requested.

For a non-blocking socket, `recv()` returns immediately. If no bytes are available, it usually returns `-1` and sets `errno` to `EAGAIN` or `EWOULDBLOCK`.

One `recv()` result does not correspond to one protocol frame or one application message. It can contain:

- Part of one frame.
- Exactly one frame.
- Several frames.
- The end of one frame and the beginning of the next frame.

### Messages are not logically complete

Now that we know that reads and writes can be partial, we know that messages we send or receive are not always complete. Socket read/write buffers are stream buffers; hence, they cannot guarantee a message boundary. In general, TCP doesn't guarantee message boundaries.

### Protocol Primer

A protocol is nothing but a set of rules and guidelines that all involved parties agree upon in order to communicate or achieve a task. Similarly, a network protocol is nothing but a set of rules and guidelines that two or more involved peers agree upon and adhere to throughout.

A frame is a logical protocol-level unit of bytes. It has a logical beginning and end, irrespective of partial reads and writes by the OS. TCP does not expose those boundaries to the application. The protocol parser reconstructs them from the TCP byte stream.

Before you can do anything, you need to know what a frame looks like. This is what we call the **wire format.**

## Protocol Frames

### Wire Format

Wire format is nothing but the specification of how each byte in a frame is laid out and what it means to the protocol. It defines which bytes mean what to the protocol.

The logical boundaries of a frame are determined by the various flavours in which a frame wire format is laid out: **fixed size**, **length prefix**, **delimited**, or **connection-close boundary**. Let us go through each of them one by one.

### Fixed-size frames

In a fixed-size frame, the protocol frame boundary is fixed: **every N bytes**.

To parse a frame, we maintain a buffer and the length of the frame read so far. Initially, the buffer and the length are zeroed.

Run a while loop while the read length is less than `FRAME_SIZE`. Start from `frame->buf + frame->len`, which initially points to the start of the buffer. On subsequent iterations, advance the pointer by however much has already been read into the buffer.

`FRAME_SIZE - frame->len` is initially 32 when the frame size is 32. Going forward, we only read what is left. Say in the first iteration we only receive 10 bytes.

```c
#include <errno.h>
#include <stdint.h>
#include <string.h>
#include <sys/socket.h>

#define FRAME_SIZE 32

struct frame {
    uint8_t buf[FRAME_SIZE];
};

//This is for a blocking socket.
static int recv_exact(int fd, uint8_t *buf, size_t want)
{
    size_t len = 0;

    while (len < want) {
        ssize_t n = recv(fd, buf + len, want - len, 0);

        if (n > 0) {
            len += (size_t)n;
            continue;
        }

        if (n == 0) {
            return 0; // The peer closed before a complete frame arrived.
        }

        if (errno == EINTR) {
            continue;
        }

        return -1;
    }

    return 1;
}

int recv_frame(int fd, struct frame *frame)
{
    return recv_exact(fd, frame->buf, sizeof(frame->buf));
}
```

Because every `recv()` call requests only the remaining bytes, it cannot read into the next fixed-size frame.

When a field on the wire is a 32-bit network-order integer, copy only that field into a `uint32_t` and then call `ntohl()`.

```c
#include <arpa/inet.h>

uint32_t wire_value;
memcpy(&wire_value, frame.buf, sizeof(wire_value));

uint32_t value = ntohl(wire_value); // use ntohs() for a 16-bit network-order integer.
```

Then parse the remaining fields according to the protocol specification.

### Length-prefixed frames

Some wire formats dedicate their **first few** **fixed N bytes** of a frame to identify the size of the given frame.

The exact meaning of the prefix is protocol-specific. It can be the payload size, the size of the header plus payload, or the size of the whole frame including the prefix. We don't assume which one it is. Read the specification.

For example, this wire format has a **four-byte, big-endian payload length**:

```text
[ 4-byte payload length ][ payload bytes... ]
```

The receiver first reads the fixed-width prefix. It then decodes and validates the length before it reads or allocates the payload.

```c
#include <arpa/inet.h>

#define FRAME_LEN_PREFIX_WIDTH 4
#define MAX_PAYLOAD_SIZE       65536

int recv_length_prefixed_frame(int fd, uint8_t *payload)
{
    uint32_t wire_size;

    if (recv_exact(fd, (uint8_t *)&wire_size, FRAME_LEN_PREFIX_WIDTH) != 1) {
        return -1;
    }

    uint32_t payload_size = ntohl(wire_size);

    if (payload_size > MAX_PAYLOAD_SIZE) {
        return -1;
    }

    return recv_exact(fd, payload, payload_size);
}

```

The caller must provide a payload buffer that is at least `MAX_PAYLOAD_SIZE` bytes long, or allocate `payload_size` bytes only after validating it.

Always validate a length before using it to allocate memory or calculate offsets. An attacker can send a huge or malformed length value.

### Delimited Frames

There are wire formats where a frame boundary is determined by a special byte or byte sequence. It is not special to use a special symbol, but rather whatever the protocol wire format defines. It could be anything, like `A`, `\0`, `\n`, or `\r\n`.

A delimited format also defines how payload data can contain the delimiter. It can forbid the delimiter, escape it, or encode the payload.

The issue with delimited frames is that we do not know the length in advance. But for security reasons, we cannot keep receiving a frame with no delimiter forever, so we almost always keep a `MAX_WIRE_FRAME_SIZE`. Always :D

Another problem is how many bytes to read. If we call `recv()`, chances are we cross the delimiter and read into another frame's territory. Those bytes are already in our application buffer. We must retain them for the next frame.

If there is no delimiter in a full buffer of maximum frame size, we know that the frame violated the maximum frame size and we can close the connection.

If we do find the delimiter, we can parse the frame, and then shift the remaining buffer bytes, all bytes after the delimiter, to the beginning of the buffer. Then reset `end -= start` and `start = 0`.

```c
#include <errno.h>
#include <stdint.h>
#include <string.h>
#include <sys/socket.h>

#define MAX_WIRE_FRAME_SIZE 10 // includes the terminating '\0'.

int receive_messages(int fd)
{
    uint8_t buf[MAX_WIRE_FRAME_SIZE];
    size_t start = 0; // first unconsumed byte.
    size_t end = 0;   // one byte after the last received byte.

    for (;;) {
        // parse every complete frame already in the buffer.
        for (;;) {
            uint8_t *nul = memchr(buf + start, '\0', end - start);
            if (nul == NULL) {
                break;
            }

            size_t frame_end = (size_t)(nul - buf);

            // payload is buf[start .. frame_end), excluding '\0'.
            // handle_frame() must finish or copy this data before buf moves.
            if (handle_frame(buf + start, frame_end - start) != 0) {
                return -1;
            }

            start = frame_end + 1; // Consume this frame and its delimiter.
        }

        // Retain an incomplete next frame.
        if (start != 0) {
            memmove(buf, buf + start, end - start);
            end -= start;
            start = 0;
        }

        // A full buffer with no '\0' violates MAX_WIRE_FRAME_SIZE.
        if (end == sizeof(buf)) {
            return -1;
        }

        ssize_t n = recv(fd, buf + end, sizeof(buf) - end, 0);

        if (n > 0) {
            end += (size_t)n;
            continue;
        }

        if (n < 0 && errno == EINTR) {
            continue;
        }

        // EOF before a delimiter, or another recv() error.
        return -1;
    }
}

```

Suppose the first `recv()` returns these 10 bytes:

```text
[ h e l l o \0 t e s t ]
```

The parser handles "hello". It keeps "test" in the receive buffer. Shift "test" to the beginning and set `start` again to 0 and `end` to 4. The next `recv()` writes after "test" and can receive its terminating `\0`.

The already-read bytes do not disappear. They remain in the application buffer until the parser consumes them.

### Connection-close boundary

Some protocols treat an orderly connection close as the end of a response or body. HTTP/1.0 responses without `Content-Length` are a common example.

When `recv()` returns 0, the peer has performed an orderly shutdown of its send direction. All bytes sent before that shutdown are available to the local application before `recv()` returns 0.

A peer can half-close a TCP connection with:

```c
shutdown(fd, SHUT_WR);
```

This tells the peer that it will not send more bytes. It can still receive bytes from the peer.

`shutdown(fd, SHUT_RD)` only affects the local receive direction. It is not a protocol-level message that tells the peer to stop replying.

Connection-close framing is less convenient than explicit framing because one connection usually carries only one response body, or the protocol needs another rule to determine where the next message starts.

**Once we have a parsed frame, each frame should be thoroughly validated.** Common causes of the majority of bugs are integer overflows, out-of-bounds reads, out-of-bounds writes, invalid lengths, malformed states, and insufficient resource limits.

## Protocol Messages

Now that we understand what protocol frames are, **a logical protocol unit**, a **protocol message** is logical data that means something to the application and is made up of one or more frames.

Let us take an example of the WebSocket protocol.

In WebSocket, frames are of several types, determined by the **opcode** field of the frame. Important types are **text, binary, continuation, close, ping,** and **pong.**

All WebSocket frames have another field called `FIN`. It tells us whether the frame is the final frame of a message. `FIN=1` means that the frame is final. `FIN=0` means that more fragments follow. A data message starts with a text or binary frame.

A frame with `FIN=1 && opcode=<DataType>` is valid. This means that the whole logical message is wrapped in a single frame.

A combination of `FIN=0 && opcode=<DataType>` refers to the start of a fragmented logical message. All **data fragments** after the first frame set `opcode=continuation.`

When a continuation frame is encountered with `FIN=1`, it is the end of that logical message.

No new text or binary frame is allowed until the fragmented data message ends. Control frames such as ping, pong, and close are allowed between fragments.

Control frames cannot be fragmented; they are a message to the protocol, another example of how a message can be a single frame.

- `SF` = start frame
- `ConF` = continuation frame
- `CF` = final continuation frame

```text
Frames:  SF,  data ConF1,  data ConF2,  data CF, data
Message: └────── one logical message ─────────┘
```

Now we can clearly see how a message is divided into several frames. **When a message is divided into several frames, this is called fragmentation**. All protocols that support fragmentation have their own mechanism to stitch these fragmented frames into a logical message. Each has its own set of rules to ensure the message doesn't get corrupted.

In the case of WebSocket, a fragmented message is the set of all frames from `FIN=0 && opcode=dataType` to `FIN=1 && opcode=continuation`, where the data type appears only in the first frame. A message can also be one frame with `FIN=1 && opcode=dataType`.

## Control Flow

All protocols are state machines. A **protocol’s RFC or Specification** defines how to move from one state to another, or how to maintain the current state, in response to some external events. These are the actions we perform to move from one state to another.

Let’s understand this through the **WebSocket and SOCKS4/SOCKS4a** protocols.

In the WebSocket protocol, assume we received a control message, which is always a single frame according to the RFC. We need to act accordingly. For example, if
we receive a **Ping frame,** we need to reply with a **Pong frame**. This does not move the state machine. Instead, it acts as a mechanism to keep the connection alive between two peers.

Suppose the next frame we receive is a **Close frame**. This message changes the state, and we need to handle the event:

1. Stop sending application messages.
2. Parse the optional status code and UTF-8 reason.
3. If we did not initiate closing, send a response Close frame.
4. Close the underlying TCP connection. If we initiated closing, either wait for a reply Close frame or wait for the timeout.
5. Release connection state and notify the application once.

In the **SOCKS4 and SOCKS4a** protocols, the peer sends a handshake frame. SOCKS4 protocol does not fragment its messages because the protocol messages are mostly small control messages, and it doesn't include big data chunks

A SOCKS4 client opens a connection and initiates the conversation with a handshake frame. It either asks the proxy to connect to a service at the
advertised IP address and port behind the proxy, using the `CONNECT` command, or asks the proxy to open a port for the advertised IP address. The proxy then accepts a connection on that port and forwards traffic from the advertised IP address to the SOCKS4 client. The proxy binds a listener, returns its bound address and port, accepts an inbound connection, and then sends a second reply.

Once the proxy receives a handshake message with the `CONNECT` command, it connects to the target peer, sets up a relay between the client and the target service, and sends a `REQUEST_GRANTED` message to the client. The client can then reach the upstream peer through the proxy.

As you can see, the state of the state machine changes here. Some sockets need to be opened, and a relay needs to be set up. When either peer closes its connection, we clean up the sockets and close all connections as bookkeeping measures. The specification defines these flows as well.

When implementing any protocol, we need to ensure that the state machine is always in a valid state. We must handle each message by performing the
required actions. This prevents invalid state transitions. These actions can include closing connections, notifying the application, replying to messages,
and processing messages in the correct order according to the specification.

## Conclusion

Drafting an RFC or implementing a protocol from an RFC is not easy, especially for modern protocols. I am not asking you to implement every protocol or reinvent the wheel. But understanding protocols is essential because only then can we weigh their pros and cons for a use case. If needed, write your own.

Suppose your use case is to broadcast all TCP from one peer to all the connected peers. Should you use WebSocket? Maybe or maybe not, because a simple join-based protocol may be enough. Peers can join the proxy, and every byte sent to the proxy is broadcast to all peers. WebSocket may still be appropriate for broadcast. It is useful when clients are browsers or when you need WebSocket ecosystem support. But all comes down to understanding the pros and cons and the use case; solving for general cases is hard, often not required.

Once we understand protocol frames and how frames get stitched as a logical message, a major part of understanding is already done. Once the message construction is done, we focus on the control flow; we try to keep the protocol state valid, avoid invalid transitions, and act according to the specification throughout the protocol's lifecycle. We also perform the necessary bookkeeping where needed.

That is all. Hope you got to know something new. Thanks for reading

**Footnote**:
*SOCKS4 does not have an IETF RFC. SOCKS5 is specified by RFC 1928. SOCKS4 and SOCKS4a are defined by older de facto specifications.*
