import React from "react";
import { LucideIcon } from "lucide-react";

interface IconBadgeProps {
  icon: LucideIcon;
  color?: "gold" | "teal" | "blue" | "green" | "red" | "purple";
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const colorVariants = {
  gold: "bg-gradient-to-br from-gold-400 to-gold-600",
  teal: "bg-gradient-to-br from-teal-500 to-teal-600",
  blue: "bg-gradient-to-br from-blue-500 to-blue-600",
  green: "bg-gradient-to-br from-green-500 to-green-600",
  red: "bg-gradient-to-br from-red-500 to-red-600",
  purple: "bg-gradient-to-br from-purple-500 to-purple-600",
};

const sizeVariants = {
  sm: {
    container: "w-10 h-10",
    icon: "w-5 h-5",
  },
  md: {
    container: "w-12 h-12",
    icon: "w-6 h-6",
  },
  lg: {
    container: "w-16 h-16",
    icon: "w-8 h-8",
  },
};

/**
 * Reusable icon badge component
 * Used for contact cards, info cards, and feature highlights
 */
export const IconBadge: React.FC<IconBadgeProps> = ({
  icon: Icon,
  color = "gold",
  size = "md",
  className = "",
  animated = false,
}) => {
  const colorClass = colorVariants[color];
  const { container, icon: iconSize } = sizeVariants[size];

  return (
    <div
      className={`${container} ${colorClass} rounded-xl flex items-center justify-center text-white ${
        animated ? "group-hover:scale-110 transition-transform duration-300" : ""
      } ${className}`}
    >
      <Icon className={iconSize} />
    </div>
  );
};

interface IconBadgeOutlineProps {
  icon: LucideIcon;
  color?: "gold" | "teal" | "blue" | "green" | "red" | "purple";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const outlineColorVariants = {
  gold: {
    bg: "bg-gold-50",
    border: "border-gold-200",
    text: "text-gold-600",
  },
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-600",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-600",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-600",
  },
};

/**
 * Outlined variant of IconBadge
 * Used for subtle icon containers
 */
export const IconBadgeOutline: React.FC<IconBadgeOutlineProps> = ({
  icon: Icon,
  color = "gold",
  size = "md",
  className = "",
}) => {
  const colors = outlineColorVariants[color];
  const { container, icon: iconSize } = sizeVariants[size];

  return (
    <div
      className={`${container} ${colors.bg} border ${colors.border} rounded-lg flex items-center justify-center ${className}`}
    >
      <span className={colors.text}>
        <Icon className={iconSize} />
      </span>
    </div>
  );
};
