"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Ceva nu a mers bine
        </h2>
        <p className="text-gray-600 mb-8">
          Ne pare rău, a apărut o eroare neașteptată.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-medium hover:from-gold-600 hover:to-gold-700 transition-colors"
        >
          Încearcă din nou
        </button>
      </div>
    </div>
  );
}
