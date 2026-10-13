function Hero() {
  return (
    <section className="px-6 py-20 sm:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Hero Top Section */}
        <div className="grid items-center gap-10 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div>

            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Plan. Assign. Track.
            </h2>

            <h3 className="mt-3 text-4xl font-bold text-blue-400 sm:text-5xl">
              Collaborate. Complete.
            </h3>

            <p className="mt-6 max-w-xl text-lg font-semibold italic text-gray-300">
              From planning to completion, all in one place.
            </p>


<div className="mt-8 flex flex-col gap-4 sm:flex-row">
  <button
    onClick={() => (window.location.href = "/login")}
    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
  >
    Get Started
  </button>

  <button
    onClick={() =>
      document.getElementById("features")?.scrollIntoView({
        behavior: "smooth",
      })
    }
    className="rounded-lg border border-gray-600 px-6 py-3 font-semibold text-gray-200 transition hover:border-blue-400"
  >
    Explore Features
  </button>
</div>


          </div>


          {/* RIGHT SIDE - WORKFLOWX ORBIT */}
         <div className="workflow-orbit max-w-full overflow-hidden">

            {/* Dotted Oval Path */}
            <svg
              className="orbit-path"
              viewBox="0 0 520 300"
              fill="none"
            >
              <ellipse
                cx="260"
                cy="150"
                rx="205"
                ry="105"
                className="orbit-line"
              />
            </svg>


            {/* WorkFlowX Center Logo */}
            <div className="orbit-logo">
              <span>WorkFlow</span>
              <span className="text-blue-400">X</span>
            </div>


            {/* Moving Paper Plane */}
            <div className="orbit-plane">

              <svg
                viewBox="0 0 120 120"
                fill="none"
                className="plane-svg"
              >

                <defs>

                  <linearGradient
                    id="planeGradient"
                    x1="15"
                    y1="20"
                    x2="100"
                    y2="100"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#60D8FF" />

                    <stop offset="45%" stopColor="#3B82F6" />

                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>

                </defs>


                {/* Main Paper Plane */}
                <path
                  d="M10 52L108 10L72 108L52 68L10 52Z"
                  fill="url(#planeGradient)"
                />


                {/* Inner Fold */}
                <path
                  d="M52 68L108 10L72 108L52 68Z"
                  fill="#6366F1"
                  opacity="0.85"
                />


                {/* Highlight */}
                <path
                  d="M10 52L108 10L52 68L10 52Z"
                  fill="#8BE7FF"
                  opacity="0.45"
                />

              </svg>

            </div>

          </div>

        </div>


        {/* PROJECT OVERVIEW */}
        <div className="mt-16 rounded-2xl border border-blue-800/50 bg-blue-900/60 p-6 shadow-2xl">

          {/* Project Header */}
          <div className="mb-6 flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-400">
                Project Overview
              </p>

              <h3 className="text-xl font-semibold text-white">
                CraveCraft 2.0
              </h3>

            </div>


            <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
              On Track
            </span>

          </div>


          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* Tasks */}
            <div className="rounded-xl bg-blue-950 p-4">

              <p className="text-sm text-gray-400">
                Tasks
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                24
              </p>

            </div>


            {/* Completed */}
            <div className="rounded-xl bg-blue-950 p-4">

              <p className="text-sm text-gray-400">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                18
              </p>

            </div>


            {/* Members */}
            <div className="rounded-xl bg-blue-950 p-4">

              <p className="text-sm text-gray-400">
                Members
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                06
              </p>

            </div>

          </div>


          {/* Project Progress */}
          <div className="mt-6 rounded-xl bg-blue-950 p-5">

            <div className="mb-3 flex justify-between">

              <span className="text-sm text-gray-400">
                Project Progress
              </span>

              <span className="text-sm font-semibold text-blue-400">
                75%
              </span>

            </div>


            {/* Progress Bar */}
            <div className="h-2 rounded-full bg-blue-900">

              <div className="h-2 w-3/4 rounded-full bg-blue-500"></div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;