function About() {
  return (
    <section
      id="about"
      className="bg-blue-950 px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">

        {/* About Content */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            About WorkFlowX
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Better teamwork.
            <span className="block text-blue-400">
              Smarter project management.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-gray-300 sm:text-base">
            WorkFlowX is a team project management platform designed to help
            small teams organize their work, assign tasks, track deadlines,
            and monitor project progress in one place.
          </p>

          <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">
            Instead of managing updates across multiple tools, teams can use
            WorkFlowX to stay organized, understand responsibilities, and
            collaborate more efficiently.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-blue-800/60 bg-slate-950/70 p-5 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
              ✓
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              Clear Responsibilities
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Keep task ownership, priorities, and deadlines organized.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-800/60 bg-slate-950/70 p-5 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
              ↗
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              Progress Visibility
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Understand project progress and identify pending work.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-800/60 bg-slate-950/70 p-5 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
              ◉
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              Team Coordination
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Bring project tasks and team responsibilities together.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-800/60 bg-slate-950/70 p-5 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
              ◎
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              Organized Workflow
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Manage work from planning through completion in one workspace.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default About;