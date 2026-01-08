"use client";

import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  badge?: {
    icon?: LucideIcon;
    text: string;
    color?: "gold" | "teal" | "blue" | "green";
  };
  title: string | React.ReactNode;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const colorVariants = {
  gold: {
    bg: "bg-gradient-to-r from-gold-500/10 to-gold-600/10",
    border: "border-gold-500/20",
    iconText: "text-gold-600",
    textColor: "text-gold-700",
  },
  teal: {
    bg: "bg-gradient-to-r from-teal-500/10 to-teal-600/10",
    border: "border-teal-500/20",
    iconText: "text-teal-600",
    textColor: "text-teal-700",
  },
  blue: {
    bg: "bg-gradient-to-r from-blue-500/10 to-blue-600/10",
    border: "border-blue-500/20",
    iconText: "text-blue-600",
    textColor: "text-blue-700",
  },
  green: {
    bg: "bg-gradient-to-r from-green-500/10 to-green-600/10",
    border: "border-green-500/20",
    iconText: "text-green-600",
    textColor: "text-green-700",
  },
};

/**
 * Reusable section header component
 * Used across multiple sections to maintain consistent styling
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  description,
  align = "center",
  className = "",
}) => {
  const badgeColor = badge?.color || "gold";
  const colors = colorVariants[badgeColor];

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <motion.div
      className={`flex flex-col ${alignmentClasses[align]} mb-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Badge */}
      {badge && (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full ${colors.bg} border ${colors.border}`}
        >
          {badge.icon && <badge.icon className={`w-4 h-4 ${colors.iconText}`} />}
          <span className={`text-sm font-medium ${colors.textColor}`}>
            {badge.text}
          </span>
        </motion.div>
      )}

      {/* Title */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
        {typeof title === "string" ? (
          <span className="bg-gradient-to-r from-gold-600 to-gold-700 bg-clip-text text-transparent">
            {title}
          </span>
        ) : (
          title
        )}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-lg text-gray-600 max-w-2xl">
          {description}
        </p>
      )}
    </motion.div>
  );
};
