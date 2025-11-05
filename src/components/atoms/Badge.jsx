import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-success/20 to-emerald-100 text-emerald-800 border border-emerald-200",
    warning: "bg-gradient-to-r from-warning/20 to-amber-100 text-amber-800 border border-amber-200",
    error: "bg-gradient-to-r from-error/20 to-red-100 text-red-800 border border-red-200",
    info: "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border border-blue-200",
    primary: "bg-gradient-to-r from-primary-100 to-cyan-100 text-primary-800 border border-primary-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;