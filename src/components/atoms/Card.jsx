import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const Card = React.forwardRef(({ 
  className, 
  children,
  hover = false,
  ...props 
}, ref) => {
  const CardComponent = hover ? motion.div : "div";
  
  const hoverProps = hover ? {
    whileHover: { y: -2, transition: { duration: 0.2 } },
    className: cn(
      "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer",
      className
    )
  } : {
    className: cn(
      "bg-white rounded-lg border border-gray-200 shadow-sm",
      className
    )
  };

  return (
    <CardComponent
      ref={ref}
      {...hoverProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
});

Card.displayName = "Card";

export default Card;