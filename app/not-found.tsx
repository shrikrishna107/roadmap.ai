// app/not-found.tsx

import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-2" style={{ background: "#0B0B0B" }}>
      <div className="text-center w-full max-w-md rounded-xl shadow-lg p-6" style={{ background: "#121212", border: "1px solid #5C2E91" }}>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: "#A259FF" }}>
          Roadmap Not Found
        </h2>
        <p className="mt-2 text-base sm:text-lg" style={{ color: "#F0E6FF" }}>
          The roadmap you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-medium transition"
          style={{
            background: "#A259FF",
            color: "#0B0B0B",
          }}
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
