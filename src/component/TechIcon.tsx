import { Code2 } from "lucide-react";

export default function TechIcon({ name, className }: { name: string, className?: string }) {
    switch (name) {
      case 'React':
        return (
          <svg viewBox="-10.5 -9.45 21 18.9" className={className} fill="currentColor">
            <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
            <g stroke="currentColor" strokeWidth="1" fill="none">
              <ellipse rx="10" ry="4.5"></ellipse>
              <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
              <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
            </g>
          </svg>
        );
      case 'Next.js':
        return (
          <svg viewBox="0 0 180 180" className={className} fill="currentColor">
            <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
              <circle cx="90" cy="90" r="90" fill="#000" />
            </mask>
            <g mask="url(#mask0)">
              <circle cx="90" cy="90" r="90" fill="transparent" stroke="currentColor" strokeWidth="6" />
              <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="currentColor" />
              <rect x="115" y="54" width="12" height="72" fill="currentColor" />
            </g>
          </svg>
        );
      case 'TypeScript':
        return (
          <svg viewBox="0 0 128 128" className={className} fill="currentColor">
            <path d="M1.5 63.91V126.5H126.5V1.5H1.5V63.91ZM57.65 41.5H74.96V110.5H60.28V53.28H43.14V41.5H57.65ZM95.69 84.14C93.75 83.05 92.42 82.35 91.71 82.02C89.71 81.11 88.08 80.52 86.82 80.25C85.58 79.99 84.34 79.85 83.1 79.85C81.25 79.85 79.74 80.26 78.56 81.08C77.38 81.88 76.8 83.04 76.8 84.54C76.8 85.8 77.25 86.8 78.16 87.52C79.08 88.23 80.5 88.75 82.42 89.06C83.5 89.26 85.74 89.65 89.12 90.23C95.14 91.26 99.4 92.71 101.91 94.57C104.43 96.43 105.69 99.18 105.69 102.82C105.69 105.51 104.83 107.82 103.1 109.76C101.39 111.71 99.03 113.17 96.02 114.15C93.02 115.11 89.75 115.6 86.22 115.6C82.16 115.6 78.43 115.03 75.02 113.9C71.62 112.75 68.91 111.33 66.89 109.64L72.29 98.7C74.61 100.56 77.01 101.95 79.5 102.88C82 103.79 84.45 104.25 86.85 104.25C89.02 104.25 90.7 103.88 91.91 103.13C93.13 102.37 93.74 101.27 93.74 99.83C93.74 98.68 93.34 97.77 92.54 97.11C91.75 96.43 90.31 95.88 88.22 95.45C87.42 95.28 85.34 94.9 81.99 94.31C78.61 93.71 75.83 92.93 73.66 91.96C70.19 90.39 67.57 88.29 65.81 85.64C64.06 82.98 63.18 79.82 63.18 76.16C63.18 73.18 64.04 70.62 65.77 68.49C67.51 66.36 69.91 64.76 72.99 63.71C76.08 62.64 79.54 62.11 83.39 62.11C89.59 62.11 94.81 63.38 99.06 65.91L95.69 84.14Z"/>
          </svg>
        );
      case 'Tailwind':
        return (
          <svg viewBox="0 0 54 33" className={className} fill="currentColor">
            <path d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"/>
          </svg>
        );
      case 'Node.js':
        return (
          <svg viewBox="0 0 32 32" className={className} fill="currentColor">
            <path d="M16 2L2 9v14l14 7 14-7V9L16 2zm0 2.5l10 5v13l-10 5-10-5v-13l10-5zM11 11v10h2v-6l3 1.5V21h2v-6l3 1.5V21h2V11l-5 2.5-5-2.5z"/>
          </svg>
        );
      default:
        return <Code2 className={className} />;
    }
  };