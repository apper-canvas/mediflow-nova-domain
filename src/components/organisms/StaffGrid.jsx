import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";

const StaffGrid = ({ staff, onViewStaff, onEditStaff }) => {
  const getRoleIcon = (role) => {
    const icons = {
      doctor: "UserCheck",
      nurse: "Heart",
      admin: "Settings",
      technician: "Wrench"
    };
    return icons[role] || "User";
  };

  const getRoleColor = (role) => {
    const colors = {
      doctor: "from-primary-500 to-cyan-400",
      nurse: "from-success to-emerald-400",
      admin: "from-purple-500 to-purple-400",
      technician: "from-orange-500 to-orange-400"
    };
    return colors[role] || "from-gray-500 to-gray-400";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {staff.map((member, index) => (
        <motion.div
          key={member.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card hover className="p-6">
            <div className="text-center">
              {/* Avatar */}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getRoleColor(member.role)} flex items-center justify-center`}>
                <ApperIcon name={getRoleIcon(member.role)} className="w-8 h-8 text-white" />
              </div>

              {/* Name & Role */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-sm text-gray-600 capitalize mb-2">{member.role}</p>
              
              {/* Status */}
              <div className="mb-4">
                <StatusBadge status={member.status} type="staff" />
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Building" className="w-4 h-4" />
                  <span>{member.department}</span>
                </div>
                
                {member.specialization && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="Award" className="w-4 h-4" />
                    <span>{member.specialization}</span>
                  </div>
                )}

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Clock" className="w-4 h-4" />
                  <span>{member.shiftStart} - {member.shiftEnd}</span>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Phone" className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onViewStaff(member)}
                >
                  <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onEditStaff(member)}
                >
                  <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StaffGrid;