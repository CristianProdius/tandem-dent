"use client";

import React from "react";

interface FloatingLabelInputProps {
  id: string;
  type?: "text" | "email" | "tel" | "password";
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

/**
 * Reusable floating label input component
 * Used in contact forms and newsletter subscriptions
 */
export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  type = "text",
  label,
  value,
  onChange,
  error,
  required = false,
  className = "",
  placeholder = " ",
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`peer w-full px-4 py-3 bg-white border rounded-xl transition-all duration-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-3 text-gray-600 transition-all duration-300
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
          peer-focus:-top-6 peer-focus:text-sm peer-focus:text-gold-600
          peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm"
      >
        {label} {required && "*"}
      </label>
    </div>
  );
};

interface FloatingLabelTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  rows?: number;
  className?: string;
  placeholder?: string;
}

/**
 * Reusable floating label textarea component
 */
export const FloatingLabelTextarea: React.FC<FloatingLabelTextareaProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  rows = 4,
  className = "",
  placeholder = " ",
}) => {
  return (
    <div className={`relative ${className}`}>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`peer w-full px-4 py-3 bg-white border rounded-xl transition-all duration-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none resize-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-3 text-gray-600 transition-all duration-300
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
          peer-focus:-top-6 peer-focus:text-sm peer-focus:text-gold-600
          peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-sm"
      >
        {label}
      </label>
    </div>
  );
};
