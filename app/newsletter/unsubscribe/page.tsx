"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {success ? (
          <>
            <h1 className="font-serif text-2xl mb-4">You&apos;ve been removed.</h1>
            <p className="text-stone-600 mb-8">
              You won&apos;t receive any more emails from us.
            </p>
          </>
        ) : error ? (
          <>
            <h1 className="font-serif text-2xl mb-4">Something went wrong.</h1>
            <p className="text-stone-600 mb-8">
              {error === "missing_token" 
                ? "Invalid unsubscribe link." 
                : decodeURIComponent(error)}
            </p>
          </>
        ) : (
          <>
            <h1 className="font-serif text-2xl mb-4">Unsubscribe</h1>
            <p className="text-stone-600 mb-8">
              Processing your request...
            </p>
          </>
        )}
        
        <Link 
          href="/" 
          className="text-olive hover:underline"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-stone-600">Loading...</p>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
