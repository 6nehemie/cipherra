import GitHubBtn from '@/components/buttons/github-btn';
import AuthWrapper from '@/components/wrappers/auth-wrapper';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="p-10 w-full min-h-screen flex items-center justify-center">
      <AuthWrapper>
        <GitHubBtn />
        {children}
      </AuthWrapper>
    </div>
  );
};
export default AuthLayout;
