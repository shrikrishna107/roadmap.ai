import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "@/public/logoo.jpg";

export default function ResponsiveHeader({
  user,
  clearDatabase,
  logout,
}: {
  user: { displayName?: string; email?: string };
  clearDatabase: (e: React.MouseEvent<HTMLButtonElement>) => void;
  logout: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full" style={{ background: "#0B0B0B" }}>
      {/* Desktop Header */}
      <div className="hidden lg:flex max-w-7xl mx-auto gap-32 px-4">
        <div className="flex gap-10 items-center">
          <Image
            src={Logo}
            alt="Logo"
            className="mb-7 w-[50px] mt-5 h-[50px] rounded-3xl"
          />
          <h1 className="text-3xl font-bold" style={{ color: "#A259FF" }}>
            Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span style={{ color: "#F0E6FF" }}>
            {user?.displayName || user?.email}
          </span>
          <div className="flex space-x-4">
            <Link
              href="/create"
              className="px-4 py-2 rounded-lg font-medium transition"
              style={{
                background: "#A259FF",
                color: "#0B0B0B",
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = "#B478FF";
                e.currentTarget.style.color = "#0B0B0B";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "#A259FF";
                e.currentTarget.style.color = "#0B0B0B";
              }}
            >
              Create New Roadmap
            </Link>
            <button
              onClick={clearDatabase}
              className="px-4 py-2 rounded-lg font-medium transition"
              style={{
                background: "#802EFF",
                color: "#F0E6FF",
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#B478FF")}
              onMouseOut={e => (e.currentTarget.style.background = "#802EFF")}
            >
              Clear All Roadmaps
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg font-medium transition"
              style={{
                background: "#A259FF",
                color: "#0B0B0B",
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = "#B478FF";
                e.currentTarget.style.color = "#0B0B0B";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "#A259FF";
                e.currentTarget.style.color = "#0B0B0B";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex lg:hidden items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={Logo}
            alt="Logo"
            width={40}
            height={40}
            className="w-[40px] h-[40px] rounded-3xl"
          />
          <h1 className="text-xl font-bold" style={{ color: "#A259FF" }}>
            Dashboard
          </h1>
        </div>
        <button
          className="text-2xl"
          style={{ color: "#F0E6FF" }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Sidebar/Drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          style={{ background: "rgba(11,11,11,0.95)" }}
        >
          <div className="w-72 max-w-full h-full bg-[#121212] shadow-lg flex flex-col p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="w-[40px] h-[40px] rounded-3xl"
                />
                <h1 className="text-xl font-bold" style={{ color: "#A259FF" }}>
                  Dashboard
                </h1>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-2xl"
                style={{ color: "#F0E6FF" }}
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>
            <span className="mb-6 block font-bold underline" style={{ color: "#F0E6FF" }}>
              {user?.displayName || user?.email}
            </span>
            <Link
              href="/create"
              className="mb-3 px-4 py-2 rounded-lg font-medium transition text-center"
              style={{
                background: "#A259FF",
                color: "#0B0B0B",
              }}
              onClick={() => setMenuOpen(false)}
              onMouseOver={e => {
                e.currentTarget.style.background = "#B478FF";
                e.currentTarget.style.color = "#0B0B0B";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "#A259FF";
                e.currentTarget.style.color = "#0B0B0B";
              }}
            >
              Create New Roadmap
            </Link>
            <button
              onClick={(e) => {
                clearDatabase(e);
                setMenuOpen(false);
              }}
              className="mb-3 px-4 py-2 rounded-lg font-medium transition"
              style={{
                background: "#802EFF",
                color: "#F0E6FF",
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#B478FF")}
              onMouseOut={e => (e.currentTarget.style.background = "#802EFF")}
            >
              Clear All Roadmaps
            </button>
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="px-4 py-2 rounded-lg font-medium transition"
              style={{
                background: "#A259FF",
                color: "#0B0B0B",
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = "#B478FF";
                e.currentTarget.style.color = "#0B0B0B";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "#A259FF";
                e.currentTarget.style.color = "#0B0B0B";
              }}
            >
              Logout
            </button>
          </div>
          {/* Overlay to close the sidebar */}
          <div
            className="flex-1"
            onClick={() => setMenuOpen(false)}
            aria-label="Close sidebar"
          />
        </div>
      )}
    </header>
  );
}
