import { ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: Props) {
  return (
    <section
      className={clsx(
        'rounded-card border border-white/10 bg-panel p-4 shadow-soft backdrop-blur-md',
        className,
      )}
    >
      {children}
    </section>
  );
}
