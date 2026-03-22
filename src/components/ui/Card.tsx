import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -2 }}
        className={cn(
          "glass glow-border rounded-xl p-5 overflow-hidden relative group",
          className
        )}
        {...props}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        {props.children as React.ReactNode}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
