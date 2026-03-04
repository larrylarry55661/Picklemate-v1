import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function NeonButton({ className, ...props }: Props) {
  return (
    <button
      className={clsx(
        'rounded-2xl bg-neon px-4 py-2 font-bold text-black shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
