import { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const currentTime = format(new Date(), "EEEE, MMMM do, yyyy 'at' h:mm a");

  const handleSearch = (query) => {
    if (query.trim()) {
      // Mock search results
      setSearchResults([
        { type: "patient", name: "John Doe", id: "P001", status: "admitted" },
        { type: "staff", name: "Dr. Smith", id: "S001", role: "doctor" },
        { type: "appointment", name: "Jane Wilson", id: "A001", time: "2:00 PM" }
      ]);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <header className="lg:ml-64 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Left section - Title and Time */}
        <div className="flex-1 min-w-0 ml-12 lg:ml-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Healthcare Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {currentTime}
          </p>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-4 relative">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search patients, staff, appointments..."
            className="w-full"
          />
          
          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-100 to-cyan-100 flex items-center justify-center">
                      <ApperIcon 
                        name={result.type === "patient" ? "User" : result.type === "staff" ? "UserCheck" : "Calendar"} 
                        className="w-4 h-4 text-primary-600" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{result.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{result.type} - {result.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right section - User Profile */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <ApperIcon name="Bell" className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-cyan-400 flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Dr. Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;