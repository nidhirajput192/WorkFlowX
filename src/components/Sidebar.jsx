// import { Link } from "react-router-dom";
// function Sidebar() {
//   return (
//     <aside className="hidden min-h-screen w-64 border-r border-blue-900/50 bg-blue-950/80 p-5 md:block">

//       {/* Logo */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-white">
//           WorkFlow<span className="text-blue-400">X</span>
//         </h1>

//         <p className="mt-1 text-xs text-gray-500">
//           Team workspace
//         </p>
//       </div>

//       {/* Navigation */}
//       <nav className="space-y-2">

//         <Link
//   to="/dashboard"
//   className="flex items-center gap-3 rounded-lg bg-blue-600/20 px-4 py-3 text-sm font-medium text-blue-400"
// >
//   <span>▣</span>
//   Dashboard
// </Link>

//         <Link
//   to="/projects"
//   className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-blue-900/40 hover:text-white"
// >
//   <span>◈</span>
//   Projects
// </Link>

//         <Link
//   to="/tasks"
//   className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-blue-900/40 hover:text-white"
// >
//   <span>✓</span>
//   Tasks
// </Link>
//         <Link
//   to="/team"
//   className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-blue-900/40 hover:text-white"
// >
//   <span>◉</span>
//   Team
// </Link>

//         <Link
//   to="/analytics"
//   className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-blue-900/40 hover:text-white"
// >
//   <span>▤</span>
//   Analytics
// </Link>

//         <Link
//   to="/settings"
//   className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-blue-900/40 hover:text-white"
// >
//   <span>⚙</span>
//   Settings
// </Link>

//       </nav>

//     </aside>
//   );
// }

// export default Sidebar;




import { Link } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 min-h-screen w-64 border-r border-blue-900/50 bg-blue-950/95 p-5 transition-transform duration-300 md:static md:block md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* Logo */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              WorkFlow<span className="text-blue-400">X</span>
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Team workspace
            </p>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="text-xl text-gray-400 md:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">

          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-lg bg-blue-600/20 px-4 py-3 text-sm font-medium text-blue-400"
          >
            <span>▣</span>
            Dashboard
          </Link>

          <Link
            to="/projects"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-blue-900/40 hover:text-white"
          >
            <span>◈</span>
            Projects
          </Link>

          <Link
            to="/tasks"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-blue-900/40 hover:text-white"
          >
            <span>✓</span>
            Tasks
          </Link>

          <Link
            to="/team"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-blue-900/40 hover:text-white"
          >
            <span>◉</span>
            Team
          </Link>

          <Link
            to="/analytics"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-blue-900/40 hover:text-white"
          >
            <span>▤</span>
            Analytics
          </Link>

          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-400 transition hover:bg-blue-900/40 hover:text-white"
          >
            <span>⚙</span>
            Settings
          </Link>

        </nav>

      </aside>
    </>
  );
}

export default Sidebar;