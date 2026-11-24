import type { Metadata } from "next";
import App from "@/component/App";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <App />
  );
}
