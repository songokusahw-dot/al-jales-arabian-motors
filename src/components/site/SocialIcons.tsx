import { siteConfig } from "@/config/site";

type Key = keyof typeof siteConfig.social;

const ICONS: Record<Key, { label: string; path: string }> = {
  instagram: { label: "Instagram", path: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2c-2.7 0-3 0-4.1.1C4 2.3 2.3 4 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1C2.3 20 4 21.7 7.9 21.9 9 22 9.3 22 12 22s3 0 4.1-.1c3.9-.2 5.6-1.9 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1C21.7 4 20 2.3 16.1 2.1 15 2 14.7 2 12 2z" },
  x: { label: "X", path: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L2 3h6.3l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" },
  tiktok: { label: "TikTok", path: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9a7.3 7.3 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5z" },
  snapchat: { label: "Snapchat", path: "M12 2.5c2.9 0 5.2 2.2 5.2 5.4v2.3c.5.2 1.3.1 1.8-.2.6-.3 1.3.5.7 1-.6.5-1.9.9-2.3 1.2.5 1.6 2 3.4 4 3.9.5.1.5.7.1.9-.8.4-2 .5-2.4.8-.2.3-.2 1-.5 1.2-.5.3-1.6-.3-3 0-1 .2-1.8 1.6-3.6 1.6s-2.6-1.4-3.6-1.6c-1.4-.3-2.5.3-3 0-.3-.2-.3-.9-.5-1.2-.4-.3-1.6-.4-2.4-.8-.4-.2-.4-.8.1-.9 2-.5 3.5-2.3 4-3.9-.4-.3-1.7-.7-2.3-1.2-.6-.5.1-1.3.7-1 .5.3 1.3.4 1.8.2V7.9c0-3.2 2.3-5.4 5.2-5.4z" },
  youtube: { label: "YouTube", path: "M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.4-1.2.4-3.8.4-3.8s0-2.6-.4-3.8zM10 15V9l5.2 3L10 15z" },
  facebook: { label: "Facebook", path: "M14 8V6.3c0-.8.2-1.3 1.4-1.3H17V2.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V8H7.6v3.2h2.7V22H14V11.2h2.7l.4-3.2H14z" },
};

/** Renders only platforms with a real configured URL. Returns null when none are set. */
export function SocialIcons({ className }: { className?: string | undefined }) {
  const entries = (Object.keys(ICONS) as Key[]).filter((k) => !!siteConfig.social[k]);
  if (!entries.length) return null;
  return (
    <ul className={className ?? "flex items-center gap-2"}>
      {entries.map((k) => (
        <li key={k}>
          <a
            href={siteConfig.social[k] as string}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ICONS[k].label}
            className="flex size-9 items-center justify-center rounded-full border transition-colors hover:bg-accent"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
              <path d={ICONS[k].path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function hasSocialLinks(): boolean {
  return Object.values(siteConfig.social).some(Boolean);
}
