/**
 * Centralized animation configurations
 * Prevents duplication of animation patterns across components
 */

import type { Variants } from "motion/react";

// ============================================
// TRANSITION CONSTANTS
// ============================================

export const TRANSITIONS = {
  fast: { duration: 0.3 },
  medium: { duration: 0.6 },
  slow: { duration: 1 },
  bounce: { type: "spring", stiffness: 300, damping: 20 },
  smooth: { ease: "easeInOut", duration: 0.6 },
} as const;

// ============================================
// FADE ANIMATIONS
// ============================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITIONS.medium },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: TRANSITIONS.medium },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: TRANSITIONS.medium },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: TRANSITIONS.medium },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: TRANSITIONS.medium },
};

// ============================================
// SCALE ANIMATIONS
// ============================================

export const scaleIn: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: TRANSITIONS.bounce },
};

export const scaleInSubtle: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: TRANSITIONS.smooth },
};

// ============================================
// FLOATING ANIMATIONS
// ============================================

export const floatAnimation = (yRange = 30, duration = 20) => ({
  y: [0, -yRange, 0],
  transition: {
    duration,
    repeat: Infinity,
    ease: "easeInOut",
  },
});

export const floatRotate = (yRange = 30, duration = 20) => ({
  y: [0, -yRange, 0],
  rotate: [0, 360],
  transition: {
    duration,
    repeat: Infinity,
    ease: "linear",
  },
});

// Predefined float variants
export const FLOAT_SLOW = {
  y: [0, -20, 0],
  transition: {
    duration: 25,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const FLOAT_MEDIUM = {
  y: [0, -30, 0],
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const FLOAT_FAST = {
  y: [0, -40, 0],
  transition: {
    duration: 15,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// ============================================
// STAGGER CHILDREN ANIMATIONS
// ============================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ============================================
// SLIDE ANIMATIONS
// ============================================

export const slideInFromLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: TRANSITIONS.smooth },
};

export const slideInFromRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: TRANSITIONS.smooth },
};

// ============================================
// VIEWPORT ANIMATION PROPS
// ============================================

export const viewportOnce = {
  once: true,
  amount: 0.3 as const,
};

export const viewportAlways = {
  once: false,
  amount: 0.3 as const,
};

// ============================================
// COMMON ANIMATION COMBINATIONS
// ============================================

/**
 * Fade in and move up when element enters viewport
 * Most commonly used animation across the site
 */
export const fadeInUpOnScroll = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: viewportOnce,
  transition: TRANSITIONS.medium,
};

/**
 * Scale in when element enters viewport
 * Used for badges and icons
 */
export const scaleInOnScroll = {
  initial: { scale: 0, opacity: 0 },
  whileInView: { scale: 1, opacity: 1 },
  viewport: viewportOnce,
  transition: TRANSITIONS.bounce,
};

/**
 * Fade in only (no movement)
 */
export const fadeInOnScroll = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: viewportOnce,
  transition: TRANSITIONS.medium,
};

// ============================================
// HOVER ANIMATIONS
// ============================================

export const hoverScale = {
  scale: 1.05,
  transition: TRANSITIONS.fast,
};

export const hoverScaleSubtle = {
  scale: 1.02,
  transition: TRANSITIONS.fast,
};

export const hoverLift = {
  y: -5,
  transition: TRANSITIONS.fast,
};

// ============================================
// BUTTON ANIMATIONS
// ============================================

export const buttonHover = {
  scale: 1.05,
  transition: TRANSITIONS.fast,
};

export const buttonTap = {
  scale: 0.95,
  transition: TRANSITIONS.fast,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a stagger delay for list items
 * @param index - Index of the item
 * @param baseDelay - Base delay in seconds (default 0.1)
 */
export const getStaggerDelay = (index: number, baseDelay = 0.1): number => {
  return index * baseDelay;
};

/**
 * Create a custom fade in up with delay
 * @param delay - Delay in seconds
 */
export const fadeInUpWithDelay = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...TRANSITIONS.medium, delay },
  },
});
