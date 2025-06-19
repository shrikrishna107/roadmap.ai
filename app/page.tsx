"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/public/logoo.jpg";
import Image from "next/image";
import { LampContainer } from "@/components/ui/lamp";

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-950 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-purple-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'An error occurred with Google sign-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    
  <div className="flex animate-fade-in flex-col items-center mt-10 justify-center w-full">
    <Image
      src={Logo}
      alt="Logo"
      className="mb-6 w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-3xl"
    />
    <div
      className="w-full max-w-xs sm:max-w-md rounded-2xl border-2 shadow-lg p-4 sm:p-8"
      style={{
        background: "#121212", // Charcoal Black
        borderColor: "#5C2E91", // Purple Outline
      }}
    >
      <h1
        className="text-xl sm:text-3xl font-bold text-center mb-4 sm:mb-6"
        style={{ color: "#A259FF" }} // Vivid Purple
      >
        {isLogin ? 'Login' : 'Sign Up'} to Roadmap.ai
      </h1>

      {error && (
        <div
          className="px-4 py-3 rounded mb-4 text-sm sm:text-base"
          style={{
            background: "#802EFF20", // Royal Purple with transparency
            border: "1px solid #802EFF",
            color: "#F0E6FF"
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block font-medium mb-1 text-sm sm:text-base"
            style={{ color: "#A259FF" }}
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
            style={{
              background: "#1A1A1A", // Matte Black
              border: "1px solid #5C2E91",
              color: "#F0E6FF"
            }}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block font-medium mb-1 text-sm sm:text-base"
            style={{ color: "#A259FF" }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
            style={{
              background: "#1A1A1A", // Matte Black
              border: "1px solid #5C2E91",
              color: "#F0E6FF"
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out disabled:opacity-70 text-sm sm:text-base"
          style={{
            background: loading ? "#B478FF" : "#A259FF",
            color: "#0B0B0B"
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#B478FF")}
          onMouseOut={e => (e.currentTarget.style.background = loading ? "#B478FF" : "#A259FF")}
        >
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="my-4 text-sm sm:text-base" style={{ color: "#A259FF" }}>OR</p>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center font-medium py-2 px-4 border rounded-lg shadow-sm transition duration-150 ease-in-out text-sm sm:text-base"
          style={{
            background: "#F0E6FF",
            color: "#121212",
            borderColor: "#5C2E91"
          }}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm sm:text-base font-medium"
          style={{ color: "#A259FF" }}
          onMouseOver={e => (e.currentTarget.style.color = "#B478FF")}
          onMouseOut={e => (e.currentTarget.style.color = "#A259FF")}
        >
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  </div>


  );
}
