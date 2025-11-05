import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import DepartmentGrid from "@/components/organisms/DepartmentGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

import departmentService from "@/services/api/departmentService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleViewDepartment = (department) => {
    toast.info(`Viewing details for ${department.name} Department`);
  };

  const handleNewDepartment = () => {
    toast.info("Opening new department creation form");
  };

  const getTotalStats = () => {
    return {
      totalBeds: departments.reduce((sum, dept) => sum + dept.totalBeds, 0),
      occupiedBeds: departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0),
      totalStaff: departments.reduce((sum, dept) => sum + dept.staffCount, 0),
      avgOccupancy: departments.length > 0 ? 
        Math.round(departments.reduce((sum, dept) => sum + (dept.occupiedBeds / dept.totalBeds), 0) / departments.length * 100) : 0
    };
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDepartments} />;

  if (departments.length === 0) {
    return (
      <Empty
        title="No Departments Found"
        description="No hospital departments are currently configured in the system."
        actionLabel="Add Department"
        onAction={handleNewDepartment}
        icon="Building"
      />
    );
  }

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
            Department Management
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of hospital departments, capacity, and staff allocation
          </p>
        </div>
        <Button onClick={handleNewDepartment}>
          <ApperIcon name="Building" className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Hospital Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Departments</p>
              <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-400 flex items-center justify-center">
              <ApperIcon name="Building" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Beds</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBeds}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center">
              <ApperIcon name="Bed" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied Beds</p>
              <p className="text-3xl font-bold text-gray-900">{stats.occupiedBeds}</p>
              <p className="text-sm text-gray-500">of {stats.totalBeds} total</p>
            </div>
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center ${
              stats.occupiedBeds / stats.totalBeds > 0.8 
                ? "from-red-500 to-red-400" 
                : "from-success to-emerald-400"
            }`}>
              <ApperIcon name="Activity" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStaff}</p>
              <p className="text-sm text-gray-500">across all departments</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-400 flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Average Occupancy Rate */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Hospital Occupancy Rate</h3>
          <span className={`text-2xl font-bold ${
            stats.avgOccupancy >= 90 ? "text-error" :
            stats.avgOccupancy >= 70 ? "text-warning" :
            "text-success"
          }`}>
            {stats.avgOccupancy}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full transition-all duration-300 ${
              stats.avgOccupancy >= 90 ? "bg-gradient-to-r from-error to-red-400" :
              stats.avgOccupancy >= 70 ? "bg-gradient-to-r from-warning to-amber-400" :
              "bg-gradient-to-r from-success to-emerald-400"
            }`}
            style={{ width: `${stats.avgOccupancy}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>0%</span>
          <span>Average occupancy across all departments</span>
          <span>100%</span>
        </div>
      </div>

      {/* Department Grid */}
      <DepartmentGrid
        departments={departments}
        onViewDepartment={handleViewDepartment}
      />
    </div>
  );
};

export default Departments;