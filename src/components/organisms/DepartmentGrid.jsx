import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const DepartmentGrid = ({ departments, onViewDepartment }) => {
  const getDepartmentIcon = (name) => {
    const icons = {
      Cardiology: "Heart",
      Neurology: "Brain",
      Orthopedics: "Bone",
      Pediatrics: "Baby",
      Emergency: "AlertTriangle",
      "Intensive Care": "Activity",
      Radiology: "Scan",
      Surgery: "Scissors"
    };
    return icons[name] || "Building";
  };

  const getDepartmentColor = (name) => {
    const colors = {
      Cardiology: "from-red-500 to-pink-400",
      Neurology: "from-purple-500 to-indigo-400",
      Orthopedics: "from-blue-500 to-cyan-400",
      Pediatrics: "from-yellow-500 to-orange-400",
      Emergency: "from-red-600 to-red-500",
      "Intensive Care": "from-green-500 to-emerald-400",
      Radiology: "from-gray-500 to-gray-400",
      Surgery: "from-indigo-500 to-purple-400"
    };
    return colors[name] || "from-gray-500 to-gray-400";
  };

  const getOccupancyColor = (occupancyRate) => {
    if (occupancyRate >= 90) return "text-error";
    if (occupancyRate >= 70) return "text-warning";
    return "text-success";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((department, index) => {
        const occupancyRate = Math.round((department.occupiedBeds / department.totalBeds) * 100);
        
        return (
          <motion.div
            key={department.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hover className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getDepartmentColor(department.name)} flex items-center justify-center`}>
                  <ApperIcon name={getDepartmentIcon(department.name)} className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {department.floor}
                </span>
              </div>

              {/* Department Name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {department.name}
              </h3>

              {/* Head Doctor */}
              <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                <ApperIcon name="UserCheck" className="w-4 h-4" />
                <span>{department.headDoctor}</span>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                {/* Bed Occupancy */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Bed" className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Bed Occupancy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {department.occupiedBeds}/{department.totalBeds}
                    </span>
                    <span className={`text-sm font-semibold ${getOccupancyColor(occupancyRate)}`}>
                      {occupancyRate}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      occupancyRate >= 90 ? "bg-gradient-to-r from-error to-red-400" :
                      occupancyRate >= 70 ? "bg-gradient-to-r from-warning to-amber-400" :
                      "bg-gradient-to-r from-success to-emerald-400"
                    }`}
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>

                {/* Staff Count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Users" className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Staff</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {department.staffCount} members
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onViewDepartment(department)}
                >
                  <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DepartmentGrid;