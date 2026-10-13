

import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-blue-800/50 bg-blue-900/60 px-6 py-5 sm:px-8">

      {/* Top Navbar */}
      <div className="flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-2xl font-bold text-white">
          WorkFlowX
        </h1>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 text-gray-300 md:flex">

          <a href="#" className="transition hover:text-white">
            Home
          </a>

          <a
  href="/#features"
  onClick={() => setIsMenuOpen(false)}
  className="transition hover:text-white"
>
  Features
</a>


<a
  href="/#about"
  onClick={() => setIsMenuOpen(false)}
  className="transition hover:text-white"
>
  About
</a>

          <a
  href="/#contact"
  onClick={() => setIsMenuOpen(false)}
  className="transition hover:text-white"
>
  Contact
</a>

         <Link
  to="/login"
  onClick={() => setIsMenuOpen(false)}
  className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center font-semibold text-white"
>
  Login
</Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl text-white md:hidden"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mt-5 flex flex-col gap-4 border-t border-blue-800/50 pt-5 text-gray-300 md:hidden">

          <a href="#" className="transition hover:text-white">
            Home
          </a>

          <a
  href="/#features"
  onClick={() => setIsMenuOpen(false)}
  className="transition hover:text-white"
>
  Features
</a>
          <a
  href="/#about"
  onClick={() => setIsMenuOpen(false)}
  className="transition hover:text-white"
>
  About
</a>

<a
  href="/#contact"
  onClick={() => setIsMenuOpen(false)}
  className="transition hover:text-white"
>
  Contact
</a>

          <Link
  to="/login"
  onClick={() => setIsMenuOpen(false)}
  className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center font-semibold text-white"
>
  Login
</Link>
        </div>
      )}

    </nav>
  );
}

export default Navbar;