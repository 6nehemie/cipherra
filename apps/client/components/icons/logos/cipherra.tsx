import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CipherraProps {
  size?: 'md' | 'lg';
}

const Cipherra: React.FC<CipherraProps> = ({ size }) => {
  return (
    <Link
      href={'/'}
      className={cn('text-white font-medium', {
        ['text-lg']: !size || size === 'md',
        ['text-xl']: size === 'lg',
      })}
    >
      cipherra
    </Link>
  );
};
export default Cipherra;
