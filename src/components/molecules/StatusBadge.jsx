import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, type = "patient" }) => {
  const getStatusConfig = (status, type) => {
    const configs = {
      patient: {
        admitted: { variant: "warning", icon: "Bed", label: "Admitted" },
        outpatient: { variant: "info", icon: "User", label: "Outpatient" },
        discharged: { variant: "success", icon: "CheckCircle", label: "Discharged" }
      },
      appointment: {
        scheduled: { variant: "info", icon: "Calendar", label: "Scheduled" },
        completed: { variant: "success", icon: "CheckCircle", label: "Completed" },
        cancelled: { variant: "error", icon: "X", label: "Cancelled" },
        "no-show": { variant: "warning", icon: "AlertTriangle", label: "No Show" }
      },
      staff: {
        "on-duty": { variant: "success", icon: "Check", label: "On Duty" },
        "off-duty": { variant: "default", icon: "Clock", label: "Off Duty" },
        "on-leave": { variant: "warning", icon: "Calendar", label: "On Leave" }
      },
      bed: {
        available: { variant: "success", icon: "Check", label: "Available" },
        occupied: { variant: "error", icon: "User", label: "Occupied" },
        maintenance: { variant: "warning", icon: "Tool", label: "Maintenance" }
      }
    };

    return configs[type]?.[status] || { variant: "default", icon: "Info", label: status };
  };

  const config = getStatusConfig(status, type);

  return (
    <Badge variant={config.variant}>
      <ApperIcon name={config.icon} className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;