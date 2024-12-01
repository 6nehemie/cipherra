import Navbar from '@/components/navigations/navbars/navbar';

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="w-screen overflow-x-hidden">
      <Navbar />
      {children}
    </div>
  );
};
export default LandingLayout;
