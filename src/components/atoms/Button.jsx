import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default",
  children, 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-700 to-primary-500 text-white hover:from-primary-800 hover:to-primary-600 shadow-md hover:shadow-lg",
    secondary: "border border-primary-500 text-primary-700 hover:bg-primary-50 hover:border-primary-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
    ghost: "text-gray-700 hover:bg-gray-100",
    success: "bg-gradient-to-r from-success to-emerald-400 text-white hover:from-emerald-600 hover:to-emerald-500 shadow-md hover:shadow-lg",
    warning: "bg-gradient-to-r from-warning to-amber-400 text-white hover:from-amber-600 hover:to-amber-500 shadow-md hover:shadow-lg",
    danger: "bg-gradient-to-r from-error to-red-400 text-white hover:from-red-600 hover:to-red-500 shadow-md hover:shadow-lg"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
    lg: "h-12 px-6 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;