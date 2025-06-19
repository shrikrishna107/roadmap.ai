'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase/client'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div
      className="w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto p-4 sm:p-6 rounded-lg shadow-md"
      style={{
        background: "#121212", // Charcoal Black
        color: "#F0E6FF",      // Text
        border: "1px solid #5C2E91"
      }}
    >
      <h2
        className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center"
        style={{ color: "#A259FF" }}
      >
        {isSignUp ? 'Create Account' : 'Sign In'}
      </h2>
      
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
      
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-medium mb-1"
            style={{ color: "#A259FF" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-2 sm:px-3 py-2 rounded-md text-xs sm:text-base focus:outline-none"
            style={{
              background: "#1A1A1A",
              border: "1px solid #5C2E91",
              color: "#F0E6FF"
            }}
          />
        </div>
        
        <div>
          <label
            htmlFor="password"
            className="block text-xs sm:text-sm font-medium mb-1"
            style={{ color: "#A259FF" }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-2 sm:px-3 py-2 rounded-md text-xs sm:text-base focus:outline-none"
            style={{
              background: "#1A1A1A",
              border: "1px solid #5C2E91",
              color: "#F0E6FF"
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full font-medium py-2 sm:py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 text-sm sm:text-base"
          style={{
            background: loading ? "#B478FF" : "#A259FF",
            color: "#0B0B0B"
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#B478FF")}
          onMouseOut={e => (e.currentTarget.style.background = loading ? "#B478FF" : "#A259FF")}
        >
          {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full text-center mt-4 text-xs sm:text-base font-medium transition"
        style={{ color: "#A259FF" }}
        onMouseOver={e => (e.currentTarget.style.color = "#B478FF")}
        onMouseOut={e => (e.currentTarget.style.color = "#A259FF")}
      >
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
      
      <button
        onClick={handleSignOut}
        className="w-full text-center mt-2 text-xs sm:text-base font-medium transition"
        style={{ color: "#F0E6FF" }}
        onMouseOver={e => (e.currentTarget.style.color = "#A259FF")}
        onMouseOut={e => (e.currentTarget.style.color = "#F0E6FF")}
      >
        Sign Out
      </button>
    </div>
  );
}
