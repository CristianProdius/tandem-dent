"use client"

import * as React from "react"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Custom implementation to fix React 19 compatibility issues with input-otp library

interface InputOTPContextValue {
  value: string
  maxLength: number
  disabled?: boolean
}

const InputOTPContext = React.createContext<InputOTPContextValue | null>(null)

// Re-export for compatibility
const REGEXP_ONLY_DIGITS = /^\d+$/

interface InputOTPProps {
  maxLength: number
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  name?: string
  disabled?: boolean
  pattern?: RegExp
  autoFocus?: boolean
  className?: string
  containerClassName?: string
  children: React.ReactNode
}

function InputOTP({
  maxLength,
  value = "",
  onChange,
  onBlur,
  name,
  disabled,
  pattern,
  autoFocus,
  className,
  containerClassName,
  children,
}: InputOTPProps) {
  // Use internal state for immediate UI updates, sync with external value
  const [internalValue, setInternalValue] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Sync internal state when external value changes (e.g., form reset)
  React.useEffect(() => {
    setInternalValue(value)
  }, [value])

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    // Filter to only digits if pattern is set
    if (pattern) {
      newValue = newValue
        .split("")
        .filter((char) => /^\d$/.test(char))
        .join("")
    }

    const truncatedValue = newValue.slice(0, maxLength)
    setInternalValue(truncatedValue) // Update UI immediately
    onChange?.(truncatedValue) // Notify parent
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <InputOTPContext.Provider value={{ value: internalValue, maxLength, disabled }}>
      <div
        data-slot="input-otp"
        className={cn(
          "relative flex items-center gap-2 has-disabled:opacity-50",
          containerClassName
        )}
        onClick={handleContainerClick}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          name={name}
          value={internalValue}
          onChange={handleInput}
          onBlur={onBlur}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(
            "absolute inset-0 w-full h-full opacity-0 cursor-default",
            disabled && "cursor-not-allowed",
            className
          )}
          aria-label="One-time password"
        />
        {children}
      </div>
    </InputOTPContext.Provider>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const context = React.useContext(InputOTPContext)
  const char = context?.value[index] ?? ""
  const isActive = context
    ? index === Math.min(context.value.length, context.maxLength - 1)
    : false
  const hasFakeCaret = isActive && context?.value.length === index

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  REGEXP_ONLY_DIGITS,
}
