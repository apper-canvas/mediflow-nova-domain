import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className 
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-cyan-400 text-white",
    success: "from-success to-emerald-400 text-white",
    warning: "from-warning to-amber-400 text-white",
    error: "from-error to-red-400 text-white"
  };

  const getTrendColor = (trend) => {
    return trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-gray-500";
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus";
  };

  return (
    <Card className={className} hover>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {trend && (
              <div className="flex items-center space-x-1">
                <ApperIcon 
                  name={getTrendIcon(trend)} 
                  className={`w-4 h-4 ${getTrendColor(trend)}`} 
                />
                <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center`}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;