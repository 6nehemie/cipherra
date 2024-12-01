import Cipherra from '../icons/logos/cipherra';

interface AuthWrapperProps {
  children?: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <div className="max-w-[540px] w-full  sm:p-8 md:p-10 sm:border-[2px] border-custom-gray-3 rounded-2xl space-y-10">
      <div className="flex flex-col items-center space-y-3">
        <Cipherra size="lg" />
        <p className="text-custom-gray-1 text-sm max-w-[265px] text-center">
          Welcome to your go-to hub for smarter, safer blockchain transactions!
        </p>
      </div>

      <div>{children}</div>
    </div>
  );
};
export default AuthWrapper;
