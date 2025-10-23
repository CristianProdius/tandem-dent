import { useState } from "react";

interface UseFormSubmissionOptions<T> {
  onValidate?: (data: T) => Record<string, string> | null;
  onSuccess?: () => void;
  successDuration?: number;
  resetOnSuccess?: boolean;
}

interface UseFormSubmissionReturn<T> {
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  handleSubmit: (data: T) => Promise<void>;
  reset: () => void;
}

/**
 * Reusable hook for form submission handling
 * Manages loading, success, and error states
 *
 * @example
 * const { isSubmitting, isSuccess, errors, handleSubmit } = useFormSubmission({
 *   onValidate: (data) => {
 *     const errors = {};
 *     if (!data.email) errors.email = "Required";
 *     return Object.keys(errors).length ? errors : null;
 *   },
 *   onSuccess: () => console.log("Success!"),
 * });
 */
export const useFormSubmission = <T extends Record<string, unknown>>({
  onValidate,
  onSuccess,
  successDuration = 3000,
  resetOnSuccess = true,
}: UseFormSubmissionOptions<T> = {}): UseFormSubmissionReturn<T> => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setErrors({});
  };

  const handleSubmit = async (data: T) => {
    // Clear previous errors
    setErrors({});

    // Validate if validator provided
    if (onValidate) {
      const validationErrors = onValidate(data);
      if (validationErrors) {
        setErrors(validationErrors);
        return;
      }
    }

    // Start submission
    setIsSubmitting(true);

    try {
      // Simulate API call (replace with actual API call in production)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success
      setIsSubmitting(false);
      setIsSuccess(true);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Reset success state after duration
      if (resetOnSuccess) {
        setTimeout(() => {
          setIsSuccess(false);
        }, successDuration);
      }
    } catch {
      setIsSubmitting(false);
      setErrors({
        submit: "A apărut o eroare. Vă rugăm să încercați din nou.",
      });
    }
  };

  return {
    isSubmitting,
    isSuccess,
    errors,
    setErrors,
    handleSubmit,
    reset,
  };
};
