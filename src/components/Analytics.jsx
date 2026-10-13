

// import { useEffect, useState } from "react";

// function Analytics() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Fetch actual tasks from backend
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           throw new Error("Please log in to view analytics.");
//         }

//         const response = await fetch(
//           "http://localhost:5000/api/tasks",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await response.json();

//         if (!response.ok || !data.success) {
//           throw new Error(
//             data.message || "Unable to load analytics."
//           );
//         }

//         setTasks(data.tasks || []);
//       } catch (err) {
//         setError(err.message || "Unable to connect to backend.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);

//   // Calculate statistics dynamically
//   const total = tasks.length;

//   const completed = tasks.filter(
//     (task) => task.status === "Done"
//   ).length;

//   const inProgress = tasks.filter(
//     (task) => task.status === "In Progress"
//   ).length;

//   const toDo = tasks.filter(
//     (task) => task.status === "To Do"
//   ).length;

//   const overdue = tasks.filter(
//     (task) =>
//       task.status !== "Done" &&
//       task.dueDate &&
//       new Date(task.dueDate) < new Date()
//   ).length;

//   const completionRate =
//     total === 0
//       ? 0
//       : Math.round((completed / total) * 100);

//   // Top statistics
//   const stats = [
//     { label: "Total Tasks", value: total },
//     { label: "Completed", value: completed },
//     { label: "In Progress", value: inProgress },
//     { label: "Overdue", value: overdue },
//   ];

//   // Status chart data
//   const chartItems = [
//     {
//       label: "To Do",
//       value: toDo,
//       color: "bg-sky-500",
//       dot: "bg-sky-500",
//     },
//     {
//       label: "In Progress",
//       value: inProgress,
//       color: "bg-amber-400",
//       dot: "bg-amber-400",
//     },
//     {
//       label: "Done",
//       value: completed,
//       color: "bg-emerald-500",
//       dot: "bg-emerald-500",
//     },
//   ];

//   // Detailed status cards
//   const statusCards = [
//     {
//       label: "Completed Tasks",
//       value: completed,
//       color: "text-green-400",
//       percentage: total
//         ? Math.round((completed / total) * 100)
//         : 0,
//     },
//     {
//       label: "In Progress",
//       value: inProgress,
//       color: "text-yellow-400",
//       percentage: total
//         ? Math.round((inProgress / total) * 100)
//         : 0,
//     },
//     {
//       label: "Overdue Tasks",
//       value: overdue,
//       color: "text-red-400",
//       percentage: total
//         ? Math.round((overdue / total) * 100)
//         : 0,
//     },
//   ];

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
//         <h1 className="text-3xl font-bold">
//           Project Analytics
//         </h1>
//         <p className="mt-4 text-gray-400">
//           Loading analytics...
//         </p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
//         <h1 className="text-3xl font-bold">
//           Project Analytics
//         </h1>
//         <div className="mt-6 rounded-xl border border-red-900/50 bg-red-950/30 p-5">
//           <p className="text-red-400">{error}</p>
//           <p className="mt-2 text-sm text-gray-400">
//             Check your login and backend server.
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">

//       {/* Heading */}
//       <div>
//         {/* <p className="text-sm font-medium text-blue-400">
//           WORKFLOWX / REPORTS
//         </p> */}

//         <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
//           Project Analytics
//         </h1>

//         <p className="mt-2 text-sm text-gray-400 sm:text-base">
//           Track your team's progress and project performance.
//         </p>
//       </div>

//       {/* Statistics */}
//       <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//         {stats.map((stat, index) => (
//           <div
//             key={stat.label}
//             className="rounded-2xl border border-blue-900/50 bg-blue-950/60 p-5 transition hover:border-blue-700/70"
//           >
//             <p className="text-sm text-gray-400">
//               {stat.label}
//             </p>

//             <p className="mt-3 text-3xl font-bold">
//               {stat.value}
//             </p>

//             <p className="mt-2 text-xs text-blue-400">
//               Live task statistics
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Overall Progress */}
//       <div className="mt-8 rounded-2xl border border-blue-900/50 bg-blue-950/60 p-5 sm:p-6">
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h2 className="text-xl font-semibold">
//               Overall Task Progress
//             </h2>

//             <p className="mt-1 text-sm text-gray-400">
//               Completed tasks compared with all accessible tasks.
//             </p>
//           </div>

//           <span className="text-3xl font-bold text-blue-400">
//             {completionRate}%
//           </span>
//         </div>

//         <div
//           className="mt-6 h-3 overflow-hidden rounded-full bg-blue-900"
//           role="progressbar"
//           aria-label="Task completion progress"
//           aria-valuenow={completionRate}
//           aria-valuemin={0}
//           aria-valuemax={100}
//         >
//           <div
//             className="h-full rounded-full bg-blue-500 transition-all duration-700"
//             style={{ width: `${completionRate}%` }}
//           />
//         </div>

//         <div className="mt-3 flex justify-between text-xs text-gray-400">
//           <span>{completed} completed</span>
//           <span>{total} total tasks</span>
//         </div>
//       </div>

//       {/* Task Status Chart */}
//       <div className="mt-8 rounded-2xl border border-blue-900/50 bg-blue-950/60 p-5 sm:p-6">
//         <div>
//           <h2 className="text-xl font-semibold">
//             Task Status Analytics
//           </h2>

//           <p className="mt-2 text-sm text-gray-400">
//             Distribution of tasks across different statuses.
//           </p>
//         </div>

//         {/* Chart legend */}
//         <div className="mt-5 flex flex-wrap gap-4">
//           {chartItems.map((item) => (
//             <div
//               key={item.label}
//               className="flex items-center gap-2 text-sm text-gray-300"
//             >
//               <span
//                 className={`h-2.5 w-2.5 rounded-full ${item.dot}`}
//               />
//               {item.label}
//             </div>
//           ))}
//         </div>

//         {/* Horizontal bars */}
//         <div className="mt-7 space-y-6">
//           {chartItems.map((item) => {
//             const percentage =
//               total === 0
//                 ? 0
//                 : Math.round((item.value / total) * 100);

//             return (
//               <div key={item.label}>
//                 <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
//                   <span className="font-medium text-gray-200">
//                     {item.label}
//                   </span>

//                   <span className="text-gray-400">
//                     {item.value} tasks · {percentage}%
//                   </span>
//                 </div>

//                 <div className="h-3 overflow-hidden rounded-full bg-slate-800">
//                   <div
//                     className={`h-full rounded-full ${item.color} transition-all duration-700`}
//                     style={{ width: `${percentage}%` }}
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {total === 0 && (
//           <p className="mt-5 text-sm text-gray-400">
//             Create tasks in your projects to see the chart.
//           </p>
//         )}
//       </div>

//       {/* Detailed Task Breakdown */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold">
//           Task Breakdown
//         </h2>

//         <p className="mt-2 text-sm text-gray-400">
//           A detailed overview of your team's tasks.
//         </p>

//         <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
//           {statusCards.map((card) => (
//             <div
//               key={card.label}
//               className="rounded-2xl border border-blue-900/50 bg-blue-950/60 p-6 transition hover:border-blue-700/70"
//             >
//               <p className="text-sm text-gray-400">
//                 {card.label}
//               </p>

//               <p className="mt-3 text-3xl font-bold">
//                 {card.value}
//               </p>

//               <p className={`mt-2 text-sm ${card.color}`}>
//                 {card.percentage}% of total tasks
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Empty state */}
//       {total === 0 && (
//         <div className="mt-8 rounded-2xl border border-blue-900/50 bg-blue-950/40 p-6 text-center">
//           <h3 className="font-semibold text-gray-200">
//             No tasks available yet
//           </h3>

//           <p className="mt-2 text-sm text-gray-400">
//             Once tasks are added to your accessible projects,
//             your analytics will appear here.
//           </p>
//         </div>
//       )}

//     </div>
//   );
// }

// export default Analytics;






import { useEffect, useState } from "react";

function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch actual tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view analytics.");
        }

        const response = await fetch(
          "http://localhost:5000/api/tasks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load analytics."
          );
        }

        setTasks(data.tasks || []);
      } catch (err) {
        setError(err.message || "Unable to connect to backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Calculate statistics dynamically
  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const toDo = tasks.filter(
    (task) => task.status === "To Do"
  ).length;

  // Compare calendar dates to avoid marking today's task overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = tasks.filter((task) => {
    if (task.status === "Done" || !task.dueDate) {
      return false;
    }

    const dueDate = new Date(task.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      return false;
    }

    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;

  const completionRate =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  // Statistics cards
  const stats = [
    {
      label: "Total Tasks",
      value: total,
      description: "All accessible tasks",
      icon: "▦",
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "In Progress",
      value: inProgress,
      description: "Tasks currently active",
      icon: "↗",
      iconColor: "text-cyan-300",
      iconBg: "bg-cyan-500/10",
    },
    {
      label: "Completed",
      value: completed,
      description: "Successfully completed",
      icon: "✓",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
    },
    {
      label: "Overdue",
      value: overdue,
      description: "Tasks past their deadline",
      icon: "!",
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10",
    },
  ];

  // Status chart data
  const chartItems = [
    {
      label: "To Do",
      value: toDo,
      color: "bg-sky-500",
      dot: "bg-sky-500",
    },
    {
      label: "In Progress",
      value: inProgress,
      color: "bg-amber-400",
      dot: "bg-amber-400",
    },
    {
      label: "Completed",
      value: completed,
      color: "bg-emerald-500",
      dot: "bg-emerald-500",
    },
  ];

  // Task breakdown data
  const statusCards = [
    {
      label: "Completed Tasks",
      value: completed,
      color: "text-emerald-400",
      barColor: "bg-emerald-500",
      percentage: total
        ? Math.round((completed / total) * 100)
        : 0,
    },
    {
      label: "In Progress",
      value: inProgress,
      color: "text-amber-400",
      barColor: "bg-amber-400",
      percentage: total
        ? Math.round((inProgress / total) * 100)
        : 0,
    },
    {
      label: "Overdue Tasks",
      value: overdue,
      color: "text-rose-400",
      barColor: "bg-rose-500",
      percentage: total
        ? Math.round((overdue / total) * 100)
        : 0,
    },
  ];

  // Reusable page header
  const pageHeader = (
    <div className="relative overflow-hidden rounded-[30px] border border-blue-900/70 bg-gradient-to-br from-blue-950 via-[#101d38] to-slate-900 px-6 py-8 shadow-xl shadow-blue-950/20 sm:px-8 sm:py-10 lg:px-10 lg:py-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
          Project insights
        </div>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Project Analytics
          <span className="text-blue-400">.</span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100/80 sm:text-base lg:text-lg">
          Track your team's progress, monitor task completion,
          and understand your project performance.
        </p>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-5 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
        {pageHeader}

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-blue-900/50 bg-blue-950/40 p-6"
            >
              <div className="h-4 w-28 rounded bg-slate-800" />
              <div className="mt-5 h-8 w-16 rounded bg-slate-800" />
              <div className="mt-4 h-3 w-36 rounded bg-slate-800" />
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Loading your analytics...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-5 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
        {pageHeader}

        <div className="mt-8 rounded-2xl border border-red-900/50 bg-red-950/30 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-red-300">
            Unable to load analytics
          </h2>

          <p className="mt-3 text-sm text-red-400">{error}</p>

          <p className="mt-2 text-sm text-gray-400">
            Please check your login and backend server.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-6 text-white sm:px-6 sm:py-8 lg:px-8">

      {/* Page Header */}
      {pageHeader}

      {/* Statistics Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`rounded-2xl border bg-slate-900/80 p-5 transition duration-200 hover:-translate-y-1 hover:bg-slate-900 sm:p-6 ${
              index === 0
                ? "border-blue-900/60"
                : "border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-400">
                {stat.label}
              </p>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl font-bold ${stat.iconColor} ${stat.iconBg}`}
              >
                {stat.icon}
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold tracking-tight text-white">
              {stat.value}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <section className="mt-8 rounded-2xl border border-blue-900/50 bg-blue-950/40 p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Overall Task Progress
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              A quick look at how much of your team's work is complete.
            </p>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-blue-400">
              {completionRate}
            </span>
            <span className="text-xl font-semibold text-blue-400">
              %
            </span>
          </div>
        </div>

        <div
          className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800"
          role="progressbar"
          aria-label="Task completion progress"
          aria-valuenow={completionRate}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-400">
          <span>{completed} completed tasks</span>
          <span>{total} total tasks</span>
        </div>
      </section>

      {/* Task Status Analytics */}
      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7">
        <div>
          <h2 className="text-xl font-bold">
            Task Status Analytics
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Distribution of your tasks across different statuses.
          </p>
        </div>

        {/* Chart Legend */}
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
          {chartItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-sm text-slate-300"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${item.dot}`}
              />
              {item.label}
            </div>
          ))}
        </div>

        {/* Horizontal Bar Chart */}
        <div className="mt-7 space-y-6">
          {chartItems.map((item) => {
            const percentage =
              total === 0
                ? 0
                : Math.round((item.value / total) * 100);

            return (
              <div key={item.label}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-slate-200">
                    {item.label}
                  </span>

                  <span className="text-slate-400">
                    {item.value} tasks · {percentage}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {total === 0 && (
          <p className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
            No tasks available yet. Add tasks to your projects to see
            your status chart.
          </p>
        )}
      </section>

      {/* Task Breakdown */}
      <section className="mt-8">
        <div>
          <h2 className="text-xl font-bold">
            Task Breakdown
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Detailed progress across key task categories.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {statusCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-blue-900/70 sm:p-6"
            >
              <p className="text-sm text-slate-400">
                {card.label}
              </p>

              <div className="mt-4 flex items-end justify-between gap-3">
                <p className="text-3xl font-bold text-white">
                  {card.value}
                </p>

                <span className={`text-sm font-semibold ${card.color}`}>
                  {card.percentage}%
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${card.barColor} transition-all duration-700`}
                  style={{ width: `${card.percentage}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {card.percentage}% of all tasks
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Empty State */}
      {total === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-blue-900/50 bg-blue-950/20 p-7 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-blue-300">
            ▦
          </div>

          <h3 className="mt-4 text-lg font-semibold text-white">
            No tasks available yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
            Once tasks are added to your accessible projects, your
            analytics and progress charts will appear here.
          </p>
        </div>
      )}

    </div>
  );
}

export default Analytics;
