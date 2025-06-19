import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2296] px-2">
      <div className="text-center w-full max-w-md">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">
          Roadmap Not Found
        </h2>
        <p className="mt-2 text-[#2369] text-base sm:text-lg">
          The roadmap you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-[#0023] text-[#2296] rounded-lg text-base sm:text-lg transition hover:bg-[#2369] hover:text-white"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/create"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-[#0753] text-[#2296] rounded-lg text-base sm:text-lg transition hover:bg-[#2369] hover:text-white"
          >
            Create New Roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}
