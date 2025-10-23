import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

/**
 * Reusable error message component
 * Displays validation errors in forms
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
}) => {
  if (!message) return null;

  return (
    <p className={`text-red-500 text-sm mt-1 flex items-center gap-1 ${className}`}>
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      <span>{message}</span>
    </p>
  );
};
