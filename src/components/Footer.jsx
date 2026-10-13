function Footer() {
  return (
    <footer className="border-t border-blue-900/50 bg-slate-950 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-xl font-bold text-white">
            WorkFlowX
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Plan. Assign. Track. Collaborate. Complete.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-gray-400">
          <a href="#" className="transition hover:text-white">
            Home
          </a>

          <a href="#" className="transition hover:text-white">
            Features
          </a>

          <a href="#" className="transition hover:text-white">
            About
          </a>

          <a href="#" className="transition hover:text-white">
            Contact
          </a>
        </div>

      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-blue-900/50 pt-6 text-center text-sm text-gray-500">
        © 2026 WorkFlowX. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;