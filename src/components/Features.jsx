// function Features() {
//   return (
//     <section className="bg-slate-950 px-8 py-24">
//       <div className="mx-auto max-w-7xl">

//         <div className="text-center">
//           <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
//             Powerful Features
//           </p>

//           <h2 className="mt-3 text-4xl font-bold text-white">
//             Everything your team needs
//           </h2>

//           <p className="mx-auto mt-4 max-w-2xl text-gray-400">
//             Manage tasks, collaborate with your team, and keep your projects
//             on track from one place.
//           </p>

// <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

//   <div className="rounded-xl border border-blue-900/50 bg-blue-950/60 p-6">
//     <h3 className="text-lg font-semibold text-white">
//       Smart Task Assignment
//     </h3>

//     <p className="mt-3 text-sm leading-6 text-gray-400">
//       Assign tasks based on team skills, workload, and availability.
//     </p>
//   </div>

//   <div className="rounded-xl border border-blue-900/50 bg-blue-950/60 p-6">
//     <h3 className="text-lg font-semibold text-white">
//       Workload Detection
//     </h3>

//     <p className="mt-3 text-sm leading-6 text-gray-400">
//       Quickly identify overloaded team members and balance the workload.
//     </p>
//   </div>

//   <div className="rounded-xl border border-blue-900/50 bg-blue-950/60 p-6">
//     <h3 className="text-lg font-semibold text-white">
//       Deadline Risk Alerts
//     </h3>

//     <p className="mt-3 text-sm leading-6 text-gray-400">
//       Get alerts when tasks are falling behind or deadlines are at risk.
//     </p>
//   </div>

//   <div className="rounded-xl border border-blue-900/50 bg-blue-950/60 p-6">
//     <h3 className="text-lg font-semibold text-white">
//       Real-time Collaboration
//     </h3>

//     <p className="mt-3 text-sm leading-6 text-gray-400">
//       Keep your team updated with comments, notifications, and live updates.
//     </p>
//   </div>

// </div>

//         </div>

//       </div>
//     </section>
//   );
// }

// export default Features;





function Features() {
  return (
    <section
  id="features"
  className="bg-slate-950 px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
>

      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Powerful Features
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Everything your team needs
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-400 sm:text-base">
            Manage tasks, collaborate with your team, and keep your projects
            on track from one place.
          </p>

        </div>


        {/* Feature Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Card 1 */}
          <div className="group rounded-2xl border border-blue-900/50 bg-blue-950/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-600/60 hover:bg-blue-900/60">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              ✓
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Smart Task Assignment
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Assign tasks based on team skills, workload, and availability.
            </p>

          </div>


          {/* Card 2 */}
          <div className="group rounded-2xl border border-blue-900/50 bg-blue-950/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-600/60 hover:bg-blue-900/60">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              ◉
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Workload Detection
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Quickly identify overloaded team members and balance the workload.
            </p>

          </div>


          {/* Card 3 */}
          <div className="group rounded-2xl border border-blue-900/50 bg-blue-950/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-600/60 hover:bg-blue-900/60">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              !
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Deadline Risk Alerts
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Get alerts when tasks are falling behind or deadlines are at risk.
            </p>

          </div>


          {/* Card 4 */}
          <div className="group rounded-2xl border border-blue-900/50 bg-blue-950/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-600/60 hover:bg-blue-900/60">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              ↗
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Real-time Collaboration
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Keep your team updated with comments, notifications, and live
              updates.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Features;