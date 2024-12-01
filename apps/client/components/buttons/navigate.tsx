import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NavigateProps {
  href: string;
  label: string;
  active?: boolean;
}

const Navigate: React.FC<NavigateProps> = ({
  href,
  label = 'Continue',
  active,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium text-custom-gray-1 hover:text-white duration-200 transition-colors',
        {
          'text-white': active,
        }
      )}
    >
      {label}
    </Link>
  );
};
export default Navigate;
