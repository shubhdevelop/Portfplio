"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import SiteNav from '@/component/SiteNav';
import { useTheme } from '@/hooks/theme';
import type { Blog, Project } from '@/types/types';

const PROJECTS: Project[] = [
  {
    title: 'emuGBC',
    tagline: 'Game Boy Color emulator',
    description:
      'Game Boy DMG and Color emulator in Go and Ebiten, with the Sharp SM83 CPU (501 instructions), pixel processing unit, memory management unit and timer. Work in progress.',
    tags: ['Go', 'Ebiten', 'Emulator'],
    repoLink: 'https://github.com/shubhdevelop/emuGBC',
  },
  {
    title: 'YAKVS',
    tagline: 'Yet another key-value store',
    description: 'Redis-compatible key-value store in Go with RESP implemented from scratch, an interactive CLI, TTL handling, and AOF persistence with recovery.',
    tags: ['Go', 'RESP', 'AOF'],
    repoLink: 'https://github.com/shubhdevelop/YAKVS',
  },
  {
    title: 'Socks4',
    tagline: 'SOCKS4 / SOCKS4a proxy',
    description: 'SOCKS4 and SOCKS4a compliant proxy in C on Linux io_uring, with frame parsing, domain-name resolution, and both CONNECT and BIND commands.',
    tags: ['C', 'io_uring', 'Networking'],
    repoLink: 'https://github.com/shubhdevelop/Socks4',
  },
  {
    title: 'YAPL',
    tagline: 'Yet another programming language',
    description: 'An interpreter in Go exploring the fundamentals of interpreters and compilers.',
    tags: ['Go', 'Interpreter', 'Lang'],
    repoLink: 'https://github.com/shubhdevelop/YAPL',
  },
  {
    title: 'infiniteDraw',
    tagline: 'Infinite canvas drawing',
    description: 'An interactive drawing tool with unlimited canvas space, planned to be open source.',
    tags: ['TypeScript', 'Canvas', 'Web'],
    repoLink: 'https://github.com/shubhdevelop/infiniteDraw',
  },
];

const EXPERIENCE = [
  {
    org: 'Complyance',
    role: 'Software Engineer, Backend & Infrastructure',
    period: 'Jun 2025 - Present',
    text: 'Owning backend and infrastructure for an e-invoicing platform.',
    highlights: [
      'Owned the Railway to AWS EKS production migration of a 25-workload platform: Terraform-built three-AZ private cluster, phased cutover with canaries, and a queue-isolation audit.',
      'Built the Argo CD GitOps release pipeline: one Helm chart rendering 44 service/environment combinations, with rollback as a git revert and no cluster credentials in CI.',
      'Built three-AZ Redis HA (Sentinel, HAProxy, TLS) and ran AWS FIS AZ-isolation drills.',
      'Built a multi-tenant Peppol SMP control plane in Go with idempotency keys, rate limits and drift reconciliation.',
      'Built the submission service (per-country SQS queues for 7 countries, Redis NX idempotency locks) and shipped Greece e-invoicing; integrated LHDN and ZATCA.',
      'Built a shared SQS consumer and OpenTelemetry tracing across 17+ services.',
    ],
  },
  {
    org: 'Complyance',
    role: 'Full-Stack Developer Intern',
    period: 'Oct 2024 - Jun 2025',
    text: 'Contributed to the Phase 2 expansion of e-invoicing services in Malaysia; built custom views and report generation for localized reporting and a multi-step onboarding flow.',
  },
  {
    org: 'Real Dev Squad',
    role: 'Open Source Contributor',
    period: 'Jun 2024 - Jun 2025',
    text: 'Designed and shipped server profiles, feature flags and superuser privileges. Wrote design docs, reviewed PRs and set up Storybook.',
  },
  {
    org: 'DiceDB',
    role: 'Open Source Contributor',
    period: 'Oct 2024 - Nov 2024',
    text: 'Added persistent command history, inline syntax hints and arrow-key navigation to the CLI.',
  },
];

const EDUCATION = [
  {
    org: 'Sri Guru Gobind Singh College of Commerce, Delhi University',
    role: 'BCom (Honors)',
    period: 'Nov 2022 - Nov 2026',
  },
  {
    org: 'Kendriya Vidyalaya',
    role: 'High School Diploma, 94.6%',
    period: 'Apr 2020 - Apr 2022',
  },
];

const SKILLS = [
  { label: 'Languages', items: 'TypeScript, Go, C, Python, JavaScript' },
  { label: 'Backend', items: 'Node, Bun, Next.js, React, MongoDB, Redis, PostgreSQL' },
  { label: 'Infra', items: 'AWS (EKS, VPC, IAM, KMS, S3, SQS, WAF), Terraform, Kubernetes, Argo CD, Helm, Karpenter, KEDA, GitHub Actions' },
  { label: 'Messaging & observability', items: 'SQS, RabbitMQ, OpenTelemetry, Prometheus, Grafana, Loki' },
  { label: 'E-invoicing', items: 'Peppol, ZATCA, LHDN' },
];

const GITHUB_ACCOUNTS = ['shubhdevelop', 'shubham-complyance'];

// Scrolls to the newest weeks first when the chart is wider than the screen.
function HeatMap({ user, color, dark }: { user: string; color: string; dark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);
  return (
    <div ref={ref} className="overflow-x-auto">
      {/* biome-ignore lint/performance/noImgElement: external SVG chart */}
      <img
        src={`https://ghchart.rshah.org/${color}/${user}`}
        alt={`GitHub contribution graph for ${user}`}
        width={663}
        height={104}
        loading="lazy"
        className={`h-auto w-[663px] max-w-none md:w-full ${dark ? 'brightness-75' : ''}`}
      />
    </div>
  );
}

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'writing', label: 'Writing' },
  { id: 'activity', label: 'Activity' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
];

export default function Home({ posts }: { posts: Blog[] }) {
  const { isDarkMode: dark } = useTheme();
  const muted = dark ? 'text-zinc-400' : 'text-zinc-600';
  const body = dark ? 'text-zinc-300' : 'text-zinc-700';
  const divide = dark ? 'divide-zinc-800' : 'divide-zinc-300';
  const accentHover = dark ? 'hover:text-green-400' : 'hover:text-red-700';
  const link = `underline underline-offset-4 ${dark ? 'hover:text-green-400' : 'hover:text-red-700'}`;
  const h2 = 'mb-4 font-pixel text-sm scroll-mt-20';

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#111] text-zinc-100' : 'bg-[#eae8dc] text-zinc-900'}`}>
      <SiteNav />

      <main className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
        <section className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
          <Image
            src="/pp.jpg"
            width={72}
            height={72}
            alt="Shubham Raj"
            priority
            className="h-[72px] w-[72px] shrink-0 rounded object-cover"
          />
          <div>
            <h1 className="mb-2 font-pixel text-xl md:text-2xl">Shubham Raj</h1>
            <p className={`mb-4 leading-relaxed ${body}`}>
              Backend and infrastructure engineer and systems programming enthusiast in Chennai, India.
            </p>
            <ul className={`flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm sm:text-xs ${muted}`}>
              <li><a className={link} href="https://github.com/shubhdevelop" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a className={link} href="https://twitter.com/_Shubham2XX" target="_blank" rel="noopener noreferrer">X</a></li>
              <li><a className={link} href="https://www.linkedin.com/in/shubhamraj10" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a className={link} href="/Shubham_Raj_Resume_2026.pdf" target="_blank" rel="noopener noreferrer">Resume</a></li>
            </ul>
          </div>
        </section>

        <nav aria-label="Sections" className={`sticky top-[49px] z-10 -mx-4 mb-10 border-b px-4 py-2 backdrop-blur md:-mx-8 md:px-8 ${
          dark ? 'border-zinc-800 bg-[#111]/90' : 'border-zinc-300 bg-[#eae8dc]/90'
        }`}>
          <ul className={`flex gap-4 overflow-x-auto whitespace-nowrap font-mono text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${muted}`}>
            {SECTIONS.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} className={`block py-1.5 hover:underline underline-offset-4 ${accentHover}`}>{s.label}</a></li>
            ))}
          </ul>
        </nav>

        <section id="about" className="mb-12">
          <h2 className={h2}>About</h2>
          <div className={`space-y-3 text-base leading-7 ${body}`}>
            <p>
              I like figuring out how things work: backend, CPU, memory, networking and everything in between.
              TypeScript pays the bills; Go and C are for fun.
            </p>
            <p>
              At Complyance I work on backend and infrastructure for an e-invoicing platform: AWS, Kubernetes,
              queues and Go services. Outside work I build an emulator, a Redis-compatible key-value store, a
              SOCKS proxy and an interpreter from scratch, and{' '}
              <Link href="/blog" className={link}>write about</Link> what I learn along the way, from CPU caches to
              network protocols.
            </p>
            <p>Away from the keyboard: football, cricket, chess and photography.</p>
          </div>
        </section>

        <section id="projects" className="mb-12">
          <h2 className={h2}>Projects</h2>
          <ul className={`divide-y ${divide}`}>
            {PROJECTS.map((p) => (
              <li key={p.title} className="py-4">
                <a href={p.repoLink} target="_blank" rel="noopener noreferrer" className="group block">
                  <h3 className={`font-semibold group-hover:underline underline-offset-4 ${dark ? 'group-hover:text-green-400' : 'group-hover:text-red-700'}`}>
                    {p.title} <span className={`font-normal ${muted}`}>· {p.tagline}</span>
                  </h3>
                  <p className={`mt-1 text-sm leading-relaxed ${muted}`}>{p.description}</p>
                  <p className={`mt-1 font-mono text-xs ${muted}`}>{p.tags.join(' · ')}</p>
                </a>
              </li>
            ))}
          </ul>
          <a
            href="https://github.com/shubhdevelop?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 inline-block font-mono text-xs ${muted} ${link}`}
          >
            All repositories →
          </a>
        </section>

        <section id="writing" className="mb-12">
          <h2 className={h2}>Writing</h2>
          {posts.length === 0 ? (
            <p className={`font-mono text-sm ${muted}`}>No posts yet.</p>
          ) : (
            <ul className={`divide-y ${divide}`}>
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={post.readLink ?? '#'} className="group flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <span className={`group-hover:underline underline-offset-4 ${dark ? 'group-hover:text-green-400' : 'group-hover:text-red-700'}`}>
                      {post.title}
                    </span>
                    {post.date && (
                      <time dateTime={post.date} className={`shrink-0 font-mono text-xs ${muted}`}>
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' })}
                      </time>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/blog" className={`mt-2 inline-block font-mono text-xs ${muted} ${link}`}>
            All posts →
          </Link>
        </section>

        <section id="activity" className="mb-12">
          <h2 className={h2}>Activity</h2>
          <div className="space-y-5">
            {GITHUB_ACCOUNTS.map((user) => (
              <figure key={user}>
                <figcaption className={`mb-1 font-mono text-xs ${muted}`}>
                  <a
                    className={link}
                    href={`https://github.com/${user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{user}
                  </a>{' '}
                  · contributions, last year
                </figcaption>
                <HeatMap user={user} color={dark ? '4ade80' : '196127'} dark={dark} />
              </figure>
            ))}
          </div>
        </section>

        <section id="experience" className="mb-12">
          <h2 className={h2}>Experience</h2>
          <ul className="space-y-6">
            {EXPERIENCE.map((e) => (
              <li key={`${e.org}-${e.period}`}>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4">
                  <h3 className="font-semibold">{e.org} <span className={`font-normal ${muted}`}>· {e.role}</span></h3>
                  <span className={`font-mono text-xs ${muted}`}>{e.period}</span>
                </div>
                <p className={`mt-1 text-sm leading-relaxed ${muted}`}>{e.text}</p>
                {e.highlights && (
                  <ul className={`mt-2 ml-4 list-disc space-y-1 text-sm leading-relaxed ${muted}`}>
                    {e.highlights.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="education" className="mb-12">
          <h2 className={h2}>Education</h2>
          <ul className="space-y-3">
            {EDUCATION.map((e) => (
              <li key={e.org} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4">
                <span>{e.org} <span className={muted}>· {e.role}</span></span>
                <span className={`font-mono text-xs ${muted}`}>{e.period}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className={h2}>Tools</h2>
          <dl className="space-y-2 text-sm leading-relaxed">
            {SKILLS.map((s) => (
              <div key={s.label} className="sm:flex sm:gap-4">
                <dt className={`shrink-0 font-mono text-xs sm:w-44 sm:pt-0.5 ${muted}`}>{s.label}</dt>
                <dd className={body}>{s.items}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className={`border-t pt-6 font-mono text-xs ${muted} ${dark ? 'border-zinc-800' : 'border-zinc-300'}`}>
          &copy; {new Date().getFullYear()} Shubham Raj ·{' '}
          <a className={link} href="https://instagram.com/nemessisx_" target="_blank" rel="noopener noreferrer">Instagram</a>
        </footer>
      </main>
    </div>
  );
}
