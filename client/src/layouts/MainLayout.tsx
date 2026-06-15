import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg font-mono text-brand-light-grey">
      <Header />
      
      {/* Main content area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;