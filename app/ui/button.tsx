import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'red' | 'gray';
}

export default function Button({ children, className, variant = 'red', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        {
          'bg-red-500 hover:bg-red-400 focus-visible:outline-red-500 active:bg-red-600': variant === 'red',
          'bg-gray-500 hover:bg-gray-400 focus-visible:outline-gray-500 active:bg-gray-600': variant === 'gray',
        },
        className,
      )}
    >
      {children}
    </button>
  );
}
