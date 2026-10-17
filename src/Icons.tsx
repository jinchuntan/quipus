import type { CSSProperties } from "react";
export function Icon({
  name,
  size = 20,
  className = "",
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    diagonal: <path d="M6 18 18 6M6 6h12v12" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    conversations: (
      <>
        <rect x="4" y="4" width="16" height="13" rx="3" />
        <path d="m8 17-3 4v-5M8 9h8M8 13h5" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2m2-15a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    tasks: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4M17 3v4M3 11h18" />
      </>
    ),
    device: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M10 18h4M9 6h6v6H9z" />
      </>
    ),
    link: (
      <>
        <path d="m9 15 6-6m-5-3 2-2a5 5 0 0 1 7 7l-2 2M7 11l-2 2a5 5 0 0 0 7 7l2-2" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    wave: <path d="M3 10v4m4-7v10m5-14v18m5-14v10m4-7v4" />,
    dot: <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />,
    back: <path d="M19 12H5m5-5-5 5 5 5" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {paths[name] || paths.dot}
    </svg>
  );
}

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand ${small ? "small" : ""}`}>
      <span className="brand-mark">
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M8 6h16M16 6v21M7 13h18M11 21h10" />
          <circle cx="16" cy="27" r="2" />
        </svg>
      </span>
      quipus<span className="brand-period">.</span>
    </span>
  );
}
