import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import StaffGrid from "@/components/organisms/StaffGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

import staffService from "@/services/api/staffService";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await staffService.getAll();
      setStaff(data);
      setFilteredStaff(data);
    } catch (err) {
      setError(err.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    let filtered = [...staff];

    // Apply role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(member => member.role === filterRole);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(member => member.status === filterStatus);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member =>
        member.firstName.toLowerCase().includes(query) ||
        member.lastName.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query) ||
        (member.specialization && member.specialization.toLowerCase().includes(query))
      );
    }

    setFilteredStaff(filtered);
  }, [staff, filterRole, filterStatus, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleViewStaff = (member) => {
    toast.info(`Viewing details for ${member.firstName} ${member.lastName}`);
  };

  const handleEditStaff = (member) => {
    toast.info(`Editing ${member.firstName} ${member.lastName}`);
  };

  const handleNewStaff = () => {
    toast.info("Opening new staff registration form");
  };

  const getStatusCounts = () => {
    return {
      all: staff.length,
      "on-duty": staff.filter(s => s.status === "on-duty").length,
      "off-duty": staff.filter(s => s.status === "off-duty").length,
      "on-leave": staff.filter(s => s.status === "on-leave").length
    };
  };

  const getRoleCounts = () => {
    return {
      all: staff.length,
      doctor: staff.filter(s => s.role === "doctor").length,
      nurse: staff.filter(s => s.role === "nurse").length,
      admin: staff.filter(s => s.role === "admin").length,
      technician: staff.filter(s => s.role === "technician").length
    };
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadStaff} />;

  const statusCounts = getStatusCounts();
  const roleCounts = getRoleCounts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
            Staff Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage hospital staff, schedules, and departments
          </p>
        </div>
        <Button onClick={handleNewStaff}>
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "all" 
              ? "border-primary-500 bg-primary-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("all")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
            <ApperIcon name="Users" className="w-8 h-8 text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "on-duty" 
              ? "border-success bg-emerald-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("on-duty")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Duty</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts["on-duty"]}</p>
            </div>
            <ApperIcon name="Check" className="w-8 h-8 text-success" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "off-duty" 
              ? "border-gray-500 bg-gray-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("off-duty")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Off Duty</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts["off-duty"]}</p>
            </div>
            <ApperIcon name="Clock" className="w-8 h-8 text-gray-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "on-leave" 
              ? "border-warning bg-amber-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("on-leave")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts["on-leave"]}</p>
            </div>
            <ApperIcon name="Calendar" className="w-8 h-8 text-warning" />
          </div>
        </motion.div>
      </div>

      {/* Role Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterRole === "all" 
              ? "border-primary-500 bg-primary-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterRole("all")}
        >
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">All Roles</p>
            <p className="text-xl font-bold text-gray-900">{roleCounts.all}</p>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterRole === "doctor" 
              ? "border-primary-500 bg-primary-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterRole("doctor")}
        >
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Doctors</p>
            <p className="text-xl font-bold text-gray-900">{roleCounts.doctor}</p>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterRole === "nurse" 
              ? "border-success bg-emerald-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterRole("nurse")}
        >
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Nurses</p>
            <p className="text-xl font-bold text-gray-900">{roleCounts.nurse}</p>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterRole === "admin" 
              ? "border-purple-500 bg-purple-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterRole("admin")}
        >
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Admin</p>
            <p className="text-xl font-bold text-gray-900">{roleCounts.admin}</p>
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterRole === "technician" 
              ? "border-orange-500 bg-orange-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterRole("technician")}
        >
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Technicians</p>
            <p className="text-xl font-bold text-gray-900">{roleCounts.technician}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="min-w-[130px]"
          >
            <option value="all">All Roles</option>
            <option value="doctor">Doctors</option>
            <option value="nurse">Nurses</option>
            <option value="admin">Admin</option>
            <option value="technician">Technicians</option>
          </Select>
          
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="min-w-[130px]"
          >
            <option value="all">All Status</option>
            <option value="on-duty">On Duty</option>
            <option value="off-duty">Off Duty</option>
            <option value="on-leave">On Leave</option>
          </Select>
          
          <span className="text-sm text-gray-500">
            {filteredStaff.length} of {staff.length} staff
          </span>
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by name, department, or specialization..."
          className="flex-1 max-w-md"
        />
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <Empty
          title="No Staff Found"
          description={searchQuery ? "Try adjusting your search criteria." : "No staff members match the selected filters."}
          actionLabel="Add Staff Member"
          onAction={handleNewStaff}
          icon="Users"
        />
      ) : (
        <StaffGrid
          staff={filteredStaff}
          onViewStaff={handleViewStaff}
          onEditStaff={handleEditStaff}
        />
      )}
    </div>
  );
};

export default Staff;