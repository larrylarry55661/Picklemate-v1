'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/home', label: 'Home' },
  { href: '/sessions', label: 'Session' },
  { href: '/courts?sid=s-1', label: 'Courts' },
  { href: '/ranking', label: 'Ranking' },
  { href: '/club', label: 'Club' },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 px-2 py-2 backdrop-blur-lg">
      <ul className="mx-auto flex max-w-3xl justify-between gap-1">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href.split('?')[0]);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={`block rounded-xl px-2 py-2 text-center text-sm font-semibold ${
                  active ? 'bg-neon text-black' : 'text-white/70'
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
