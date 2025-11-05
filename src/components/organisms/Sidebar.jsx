import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Patients", path: "/patients", icon: "Users" },
    { name: "Appointments", path: "/appointments", icon: "Calendar" },
    { name: "Admissions", path: "/admissions", icon: "UserPlus" },
    { name: "Staff", path: "/staff", icon: "UserCheck" },
    { name: "Departments", path: "/departments", icon: "Building" }
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:overflow-y-auto lg:bg-white lg:border-r lg:border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-700 to-primary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Activity" className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
            MediFlow
          </span>
        </div>
      </div>
      
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary-50 to-cyan-50 text-primary-700 border-l-4 border-primary-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                )}
              >
                <ApperIcon
                  name={item.icon}
                  className="mr-3 h-5 w-5 flex-shrink-0"
                />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 overflow-y-auto"
          >
            <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-700 to-primary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Activity" className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                  MediFlow
                </span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="mt-6 px-3">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) => cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-primary-50 to-cyan-50 text-primary-700 border-l-4 border-primary-500"
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                      )}
                    >
                      <ApperIcon
                        name={item.icon}
                        className="mr-3 h-5 w-5 flex-shrink-0"
                      />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
      
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-md shadow-lg border border-gray-200"
      >
        <ApperIcon name="Menu" className="w-5 h-5 text-gray-700" />
      </button>
    </>
  );
};

export default Sidebar;