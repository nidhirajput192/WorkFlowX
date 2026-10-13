
// import Sidebar from "./Sidebar";
// import { useState, useEffect } from "react";
// import api from "../api/api";
// import { Link } from "react-router-dom";

// function getId(value) {
//   if (!value) return "";
//   if (typeof value === "object") {
//     return String(value._id || value.id || "");
//   }
//   return String(value);
// }

// function Dashboard() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [projects, setProjects] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           if (!cancelled) {
//             setError("Please log in again.");
//           }
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const [projectResponse, taskResponse] = await Promise.all([
//           api.get("/projects", config),
//           api.get("/tasks", config),
//         ]);

//         if (cancelled) return;

//         const projectData = projectResponse.data.projects;
//         const taskData = taskResponse.data.tasks;

//         setProjects(Array.isArray(projectData) ? projectData : []);
//         setTasks(Array.isArray(taskData) ? taskData : []);
//       } catch (err) {
//         if (!cancelled) {
//           setError(
//             err.response?.data?.message ||
//               "Unable to load dashboard data."
//           );
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchDashboardData();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const stats = {
//     totalProjects: projects.length,

//     activeTasks: tasks.filter(
//       (task) => task.status === "In Progress"
//     ).length,

//     completedTasks: tasks.filter(
//       (task) => task.status === "Done"
//     ).length,

//     teamMembers: new Set(
//       projects.flatMap((project) => [
//         getId(project.owner),
//         ...(project.members || []).map((member) =>
//           getId(member)
//         ),
//       ]).filter(Boolean)
//     ).size,
//   };

//   const getProjectProgress = (project, projectTasks) => {
//     // A project marked Completed should show 100%.
//     if (project.status === "Completed") {
//       return 100;
//     }

//     // Otherwise calculate progress from its actual tasks.
//     if (projectTasks.length === 0) {
//       return 0;
//     }

//     const completedTasks = projectTasks.filter(
//       (task) => task.status === "Done"
//     ).length;

//     return Math.round(
//       (completedTasks / projectTasks.length) * 100
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       <div className="flex">
//         <Sidebar
//           isOpen={isSidebarOpen}
//           setIsOpen={setIsSidebarOpen}
//         />

//         <div className="min-w-0 flex-1">
//           {/* Navbar */}
//           <header className="border-b border-blue-900/50 bg-blue-950/70 px-4 py-4 sm:px-6">
//             <div className="flex items-center justify-between gap-3">
//               <div className="flex items-center gap-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsSidebarOpen(true)}
//                   className="text-2xl text-gray-300 md:hidden"
//                   aria-label="Open sidebar"
//                 >
//                   ☰
//                 </button>

//                 <h1 className="text-xl font-bold md:hidden">
//                   WorkFlow<span className="text-blue-400">X</span>
//                 </h1>
//               </div>

//               <div className="ml-auto flex items-center gap-2 sm:gap-3">
//                 <Link
//                   to="/profile"
//                   className="rounded-lg border border-blue-800 px-3 py-2 text-sm text-gray-300 transition hover:bg-blue-900 sm:px-4"
//                 >
//                   Profile
//                 </Link>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     localStorage.removeItem("token");
//                     localStorage.removeItem("user");
//                     window.location.href = "/login";
//                   }}
//                   className="rounded-lg border border-red-800/70 bg-red-950/40 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-900/60 sm:px-4"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </header>

//           {/* Main */}
//           <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
//             <div>
//               <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
//                 Welcome back! 👋
//               </h2>

//               <p className="mt-2 text-sm text-gray-400 sm:text-base">
//                 Here's what's happening with your projects.
//               </p>
//             </div>

//             {/* Stats */}
//             <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//               <div className="rounded-2xl border border-blue-900/50 bg-blue-950/60 p-5">
//                 <p className="text-sm text-gray-400">
//                   Total Projects
//                 </p>
//                 <p className="mt-3 text-3xl font-bold">
//                   {String(stats.totalProjects).padStart(2, "0")}
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-blue-900/50 bg-blue-950/60 p-5">
//                 <p className="text-sm text-gray-400">
//                   Active Tasks
//                 </p>
//                 <p className="mt-3 text-3xl font-bold">
//                   {stats.activeTasks}
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-blue-900/50 bg-blue-950/60 p-5">
//                 <p className="text-sm text-gray-400">
//                   Completed Tasks
//                 </p>
//                 <p className="mt-3 text-3xl font-bold">
//                   {stats.completedTasks}
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-blue-900/50 bg-blue-950/60 p-5">
//                 <p className="text-sm text-gray-400">
//                   Team Members
//                 </p>
//                 <p className="mt-3 text-3xl font-bold">
//                   {String(stats.teamMembers).padStart(2, "0")}
//                 </p>
//               </div>
//             </div>

//             {/* Recent Projects */}
//             <section className="mt-10">
//               <div className="flex items-center justify-between gap-3">
//                 <h3 className="text-xl font-semibold">
//                   Recent Projects
//                 </h3>

//                 <Link
//                   to="/projects"
//                   className="text-sm font-semibold text-blue-400 hover:text-blue-300"
//                 >
//                   View All
//                 </Link>
//               </div>

//               {loading ? (
//                 <p className="mt-5 text-gray-400">
//                   Loading dashboard data...
//                 </p>
//               ) : error ? (
//                 <div className="mt-5 rounded-xl border border-red-800/50 bg-red-950/30 p-4">
//                   <p className="text-red-300">{error}</p>
//                   <button
//                     type="button"
//                     onClick={() => window.location.reload()}
//                     className="mt-3 text-sm text-blue-300 underline"
//                   >
//                     Try again
//                   </button>
//                 </div>
//               ) : projects.length === 0 ? (
//                 <div className="mt-5 rounded-2xl border border-blue-900/50 bg-blue-950/60 p-6">
//                   <p className="text-gray-300">No projects yet.</p>
//                   <p className="mt-2 text-sm text-gray-400">
//                     Create your first project to see it here.
//                   </p>
//                   <Link
//                     to="/projects"
//                     className="mt-4 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
//                   >
//                     Create a project
//                   </Link>
//                 </div>
//               ) : (
//                 <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
//                   {projects.slice(0, 4).map((project) => {
//                     const projectId = getId(project);

//                     const projectTasks = tasks.filter(
//                       (task) =>
//                         getId(task.project) === projectId
//                     );

//                     const progress = getProjectProgress(
//                       project,
//                       projectTasks
//                     );

//                     return (
//                       <article
//                         key={projectId}
//                         className="rounded-2xl border border-blue-900/50 bg-blue-950/60 p-5 sm:p-6"
//                       >
//                         <div className="flex items-start justify-between gap-3">
//                           <div className="min-w-0">
//                             <h4 className=" text-lg font-semibold">
//                               {project.name}
//                             </h4>

//                             <p className="mt-1 text-sm text-gray-400">
//                               {project.description ||
//                                 "No description added"}
//                             </p>
//                           </div>

//                           <span className="shrink-0 rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
//                             {project.status || "Planning"}
//                           </span>
//                         </div>

//                         <div className="mt-6">
//                           <div className="flex justify-between gap-3 text-sm">
//                             <span className="text-gray-400">
//                               Progress
//                             </span>
//                             <span className="font-medium text-blue-400">
//                               {progress}%
//                             </span>
//                           </div>

//                           <div
//                             className="mt-2 h-2 overflow-hidden rounded-full bg-blue-900"
//                             role="progressbar"
//                             aria-label={`${project.name} progress`}
//                             aria-valuemin={0}
//                             aria-valuemax={100}
//                             aria-valuenow={progress}
//                           >
//                             <div
//                               className="h-full rounded-full bg-blue-500 transition-all duration-300"
//                               style={{ width: `${progress}%` }}
//                             />
//                           </div>

//                           <p className="mt-2 text-xs text-gray-400">
//                             {project.status === "Completed"
//                               ? "Project marked as completed"
//                               : `${projectTasks.filter(
//                                   (task) => task.status === "Done"
//                                 ).length} of ${projectTasks.length} tasks completed`}
//                           </p>
//                         </div>

//                         <div className="mt-5">
//                           <Link
//                             to="/projects"
//                             className="inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
//                           >
//                             View project details →
//                           </Link>
//                         </div>
//                       </article>
//                     );
//                   })}
//                 </div>
//               )}
//             </section>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;





import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

function getId(value) {
  if (!value) return "";
  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }
  return String(value);
}

const statStyles = [
  {
    label: "Total Projects",
    icon: "▦",
    color: "text-blue-300",
    iconBg: "bg-blue-500/15",
    glow: "from-blue-500/10",
    getValue: (stats) => String(stats.totalProjects).padStart(2, "0"),
    note: "Projects in your workspace",
  },
  {
    label: "Active Tasks",
    icon: "↗",
    color: "text-cyan-300",
    iconBg: "bg-cyan-500/15",
    glow: "from-cyan-500/10",
    getValue: (stats) => stats.activeTasks,
    note: "Tasks currently in progress",
  },
  {
    label: "Completed Tasks",
    icon: "✓",
    color: "text-emerald-300",
    iconBg: "bg-emerald-500/15",
    glow: "from-emerald-500/10",
    getValue: (stats) => stats.completedTasks,
    note: "Tasks marked as done",
  },
  {
    label: "Team Members",
    icon: "♧",
    color: "text-violet-300",
    iconBg: "bg-violet-500/15",
    glow: "from-violet-500/10",
    getValue: (stats) => String(stats.teamMembers).padStart(2, "0"),
    note: "Unique project members",
  },
];

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          if (!cancelled) setError("Please log in again.");
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [projectResponse, taskResponse] = await Promise.all([
          api.get("/projects", config),
          api.get("/tasks", config),
        ]);

        if (cancelled) return;

        const projectData = projectResponse.data.projects;
        const taskData = taskResponse.data.tasks;

        setProjects(Array.isArray(projectData) ? projectData : []);
        setTasks(Array.isArray(taskData) ? taskData : []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load dashboard data."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = {
    totalProjects: projects.length,
    activeTasks: tasks.filter(
      (task) => task.status === "In Progress"
    ).length,
    completedTasks: tasks.filter(
      (task) => task.status === "Done"
    ).length,
    teamMembers: new Set(
      projects
        .flatMap((project) => [
          getId(project.owner),
          ...(project.members || []).map((member) => getId(member)),
        ])
        .filter(Boolean)
    ).size,
  };

  const getProjectProgress = (project, projectTasks) => {
    if (project.status === "Completed") return 100;
    if (projectTasks.length === 0) return 0;

    const completedTasks = projectTasks.filter(
      (task) => task.status === "Done"
    ).length;

    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <div className="min-w-0 flex-1">
          {/* Top navigation */}
          <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0b1426]/95 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-xl text-gray-300 transition hover:bg-blue-500/10 md:hidden"
                  aria-label="Open sidebar"
                >
                  ☰
                </button>

                <div className="md:hidden">
                  <p className="text-lg font-bold tracking-tight">
                    WorkFlow<span className="text-blue-400">X</span>
                  </p>
                  <p className="text-xs text-slate-500">Workspace</p>
                </div>

                <div className="hidden md:block">
                  <p className="text-sm text-slate-400">
                    Workspace / <span className="text-slate-200">Dashboard</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/profile"
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white sm:px-4"
                >
                  Profile
                </Link>

                
<button
  type="button"
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/");
  }}
  className="rounded-xl border border-rose-400/20 bg-rose-500/[0.07] px-3 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/15 sm:px-4"
>
  Logout
</button>

              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
            {/* Welcome section */}
            <section className="relative overflow-hidden rounded-3xl border border-blue-400/15  from-[#122449] via-[#101d38] to-[#0c1426] p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 right-1/4 h-48 w-48 rounded-full bg-cyan-400/[0.07] blur-3xl" />

              <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-300/20px-3 py-1.5 text-xs font-medium text-blue-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Your workspace at a glance
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    Welcome back!{" "}
                    <span className="inline-block">👋</span>
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                    Plan your work, track progress, and keep your team
                    moving forward—all in one place.
                  </p>
                </div>

                <Link
                  to="/projects"
                  className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:bg-blue-400 sm:self-center"
                >
                  View Projects <span aria-hidden="true">→</span>
                </Link>
              </div>
            </section>

            {/* Stats */}
            <section className="mt-8">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Workspace Overview</h3>
                <p className="mt-1 text-sm text-slate-500">
                  A quick summary of your team's activity.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statStyles.map((item) => (
                  <article
                    key={item.label}
                    className={`group relative overflow-hidden rounded-2xl border  ${item.glow} to-[#0d1526] p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-400/25 hover:shadow-xl hover:shadow-blue-950/20`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-slate-400">
                        {item.label}
                      </p>

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.color} text-xl font-bold`}
                        aria-hidden="true"
                      >
                        {item.icon}
                      </div>
                    </div>

                    <p className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {loading ? (
                        <span className="inline-block h-9 w-12 animate-pulse rounded-lg bg-white/10" />
                      ) : (
                        item.getValue(stats)
                      )}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {item.note}
                    </p>

                    <div className="absolute bottom-0 left-5 right-5 h-px  from-transparent via-blue-400/30 to-transparent opacity-0 transition group-hover:opacity-100" />
                  </article>
                ))}
              </div>
            </section>

            {/* Recent projects */}
            <section className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    Recent Projects
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Keep an eye on progress across your projects.
                  </p>
                </div>

                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 self-start rounded-lg px-2 py-1 text-sm font-semibold text-blue-300 transition hover:text-blue-200"
                >
                  View all projects <span aria-hidden="true">→</span>
                </Link>
              </div>

              {loading ? (
                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-2xl border border-white/[0.07] p-6"
                    >
                      <div className="h-4 w-1/2 rounded bg-white/10" />
                      <div className="mt-3 h-3 w-3/4 rounded " />
                      <div className="mt-8 h-2 rounded-full " />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="mt-5 rounded-2xl border border-rose-400/20 p-5">
                  <p className="font-medium text-rose-300">{error}</p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-3 rounded-lg border border-rose-400/20 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/10"
                  >
                    Try again
                  </button>
                </div>
              ) : projects.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10  p-8 text-center sm:p-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl text-blue-300">
                    +
                  </div>
                  <p className="mt-4 font-semibold text-white">No projects yet</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Create your first project to get your workspace started.
                  </p>
                  <Link
                    to="/projects"
                    className="mt-5 inline-flex rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
                  >
                    Create a project
                  </Link>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {projects.slice(0, 4).map((project) => {
                    const projectId = getId(project);

                    const projectTasks = tasks.filter(
                      (task) => getId(task.project) === projectId
                    );

                    const progress = getProjectProgress(project, projectTasks);
                    const completedCount = projectTasks.filter(
                      (task) => task.status === "Done"
                    ).length;

                    const statusClasses =
                      project.status === "Completed"
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : project.status === "In Progress"
                        ? "border-blue-400/20 bg-blue-400/10 text-blue-300"
                        : "border-amber-400/20 bg-amber-400/10 text-amber-200";

                    return (
                      <article
                        key={projectId}
                        className="group rounded-2xl border  bg-[#0c1425] p-5 transition duration-200 hover:border-blue-400/25 hover:bg-[#0e192d] sm:p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h4 className=" text-base font-semibold text-slate-100 sm:text-lg">
                              {project.name}
                            </h4>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                              {project.description || "No description added"}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${statusClasses}`}
                          >
                            {project.status || "Planning"}
                          </span>
                        </div>

                        <div className="mt-7">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-slate-400">Task progress</span>
                            <span className="font-semibold text-blue-300">
                              {progress}%
                            </span>
                          </div>

                          
<div
  className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-700"
  role="progressbar"
  aria-label={`${project.name} progress`}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={progress}
>
  <div
    className="h-full rounded-full bg-blue-500"
    style={{
      width: `${progress}%`,
      minWidth: progress > 0 ? "4px" : "0",
    }}
  />
</div>


                          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                            <span>
                              {project.status === "Completed"
                                ? "Project marked completed"
                                : `${completedCount} of ${projectTasks.length} tasks completed`}
                            </span>
                            <span>{projectTasks.length} tasks</span>
                          </div>
                        </div>

                        <div className="mt-5 border-t pt-4">
                          <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition group-hover:text-blue-200"
                          >
                            View project details <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <footer className="mt-12 border-t  py-5 text-center text-xs text-slate-600">
              WorkFlowX · Plan, assign, track, collaborate, complete.
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
