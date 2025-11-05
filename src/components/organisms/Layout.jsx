import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  // App-level state and methods can be defined here
  // and passed to all page components via outlet context
  const contextValue = {
    // Add app-level state and methods here when needed
    // Example: user, setUser, notifications, etc.
  };
  return (
    <div className="min-h-screen bg-sky-50">
      <Sidebar />
      <div className="lg:ml-64">
        <Header />
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
<Outlet context={contextValue} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;