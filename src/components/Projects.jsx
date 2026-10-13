

import { useEffect, useState } from "react";
import api from "../api/api";

function getId(value) {
  if (!value) return "";
  return typeof value === "object"
    ? String(value._id || value.id || "")
    : String(value);
}

function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("In Progress");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const getProgress = (project) => {
    if (project.status === "Completed") return 100;
    if (project.status === "Planning" || project.status === "To Do") return 0;

    return Math.max(0, Math.min(100, Number(project.progress) || 0));
  };

  const getMemberNames = (members) => {
    if (!Array.isArray(members) || members.length === 0) {
      return "No members added";
    }

    return (
      members
        .map((member) =>
          typeof member === "object" ? member?.name : null
        )
        .filter(Boolean)
        .join(", ") || `${members.length} member(s)`
    );
  };

  const formatDeadline = (date) => {
    if (!date) return "Not set";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "Not set";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (projectStatus) => {
    switch (projectStatus) {
      case "Completed":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
      case "In Progress":
        return "border-blue-400/20 bg-blue-400/10 text-blue-300";
      case "On Hold":
        return "border-rose-400/20 bg-rose-400/10 text-rose-300";
      case "Planning":
        return "border-amber-400/20 bg-amber-400/10 text-amber-200";
      default:
        return "border-slate-400/20 bg-slate-400/10 text-slate-300";
    }
  };

  const fetchProjects = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");

      const response = await api.get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(
        Array.isArray(response.data.projects)
          ? response.data.projects
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setProjectName("");
    setDescription("");
    setDeadline("");
    setStatus("In Progress");
    setEditingProject(null);
  };

  const openCreateForm = () => {
    resetForm();
    setError("");
    setIsModalOpen(true);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setError("");
      setSaving(true);

      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const projectData = {
        name: projectName.trim(),
        description: description.trim(),
        status,
        deadline: deadline || null,
      };

      if (editingProject) {
        const response = await api.put(
          `/projects/${editingProject._id}`,
          projectData,
          config
        );

        const updatedProject = response.data.project;

        setProjects((prev) =>
          prev.map((project) =>
            project._id === editingProject._id
              ? updatedProject
              : project
          )
        );

        if (selectedProject?._id === editingProject._id) {
          setSelectedProject(updatedProject);
        }
      } else {
        const response = await api.post(
          "/projects",
          projectData,
          config
        );

        setProjects((prev) => [response.data.project, ...prev]);
      }

      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectName(project.name || "");
    setDescription(project.description || "");
    setDeadline(
      project.deadline ? project.deadline.slice(0, 10) : ""
    );
    setStatus(project.status || "Planning");
    setError("");
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      const token = localStorage.getItem("token");

      await api.delete(`/projects/${project._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects((prev) =>
        prev.filter((item) => item._id !== project._id)
      );

      if (selectedProject?._id === project._id) {
        setSelectedProject(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete project."
      );
    }
  };

  const closeProjectForm = () => {
    setIsModalOpen(false);
    resetForm();
    setError("");
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = [
      project.name,
      project.description,
    ]
      .filter(Boolean)
      .some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const activeProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  return (
    <div className="min-h-screen bg-[#070d1a] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <main className="mx-auto max-w-7xl">
        {/* Page heading */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-[#14264a] via-[#101d38] to-[#0c1426] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/[0.08] px-3 py-1.5 text-xs font-medium text-blue-200">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Project workspace
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your Projects<span className="text-blue-400">.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Organize your work, manage deadlines, and keep every
                project moving forward.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:bg-blue-400 sm:w-auto"
            >
              <span className="text-xl leading-none">+</span>
              New Project
            </button>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-rose-400/20 bg-rose-500/[0.07] px-4 py-3 text-sm text-rose-300"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 text-lg leading-none text-rose-300 hover:text-white"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Summary cards */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Projects",
              value: projects.length,
              icon: "▦",
              color: "text-blue-300",
              iconBg: "bg-blue-500/15",
            },
            {
              label: "In Progress",
              value: activeProjects,
              icon: "↗",
              color: "text-cyan-300",
              iconBg: "bg-cyan-500/15",
            },
            {
              label: "Completed",
              value: completedProjects,
              icon: "✓",
              color: "text-emerald-300",
              iconBg: "bg-emerald-500/15",
            },
          ].map((item) => (
            <article
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0c1425] p-5 transition hover:border-blue-400/20"
            >
              <div>
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-bold">
                  {loading ? "—" : String(item.value).padStart(2, "0")}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg} ${item.color} text-2xl font-bold`}
                aria-hidden="true"
              >
                {item.icon}
              </div>
            </article>
          ))}
        </section>

        {/* Search and filter */}
        <section className="mt-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                All Projects
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading your workspace..."
                  : `${filteredProjects.length} of ${projects.length} projects`}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                >
                  ⌕
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  aria-label="Search projects"
                  className="w-full rounded-xl border border-white/10 bg-[#0c1425] py-3 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/50 sm:w-56"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter projects by status"
                className="w-full rounded-xl border border-white/10 bg-[#0c1425] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-400/50 sm:w-44"
              >
                <option value="All">All statuses</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Projects grid */}
          {loading ? (
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-white/[0.07] bg-[#0c1425] p-6"
                >
                  <div className="h-5 w-1/2 rounded bg-white/10" />
                  <div className="mt-4 h-3 w-3/4 rounded bg-white/[0.06]" />
                  <div className="mt-8 h-2 rounded-full bg-white/[0.06]" />
                  <div className="mt-8 h-10 rounded-xl bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-blue-300">
                +
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                No projects yet
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Create your first project to get your workspace started.
              </p>
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400"
              >
                Create your first project
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center">
              <p className="font-semibold text-slate-200">
                No matching projects
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Try another search term or status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-4 text-sm font-semibold text-blue-300 hover:text-blue-200"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredProjects.map((project) => {
                const progress = getProgress(project);

                return (
                  <article
                    key={project._id}
                    className="group rounded-2xl border border-white/[0.08] bg-[#0c1425] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-400/25 hover:bg-[#0e192d] sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-lg font-bold text-blue-300">
                          {(project.name || "P").charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <h3 className="break-words text-lg font-semibold text-slate-100">
                            {project.name}
                          </h3>
                          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
                            {project.description || "No description added."}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(project.status)}`}
                      >
                        {project.status || "Planning"}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mt-7">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-400">Project progress</span>
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
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                            minWidth: progress > 0 ? "4px" : "0",
                          }}
                        />
                      </div>
                    </div>

                    {/* Team and deadline */}
                    <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:grid-cols-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                          Team
                        </p>
                        <p className="mt-2 break-words text-sm text-slate-300">
                          {getMemberNames(project.members)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                          Deadline
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                          {formatDeadline(project.deadline)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditProject(project)}
                        className="rounded-xl bg-blue-500 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                      >
                        Edit Project
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-400/30 hover:bg-blue-500/10"
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project)}
                        className="col-span-2 rounded-xl border border-rose-400/15 px-3 py-2.5 text-sm font-medium text-rose-300 transition hover:border-rose-400/30 hover:bg-rose-500/[0.08]"
                      >
                        Delete Project
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-white/[0.06] py-5 text-center text-xs text-slate-600">
          WorkFlowX · Plan, assign, track, collaborate, complete.
        </footer>
      </main>

      {/* Create / Edit modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-sm sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeProjectForm();
          }}
        >
          <div className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c1528] p-5 shadow-2xl shadow-black/40 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                  Project workspace
                </p>
                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  {editingProject ? "Edit Project" : "Create New Project"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Add the details to organize your project.
                </p>
              </div>

              <button
                type="button"
                onClick={closeProjectForm}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="projectName"
                    className="text-sm font-medium text-slate-300"
                  >
                    Project Name <span className="text-blue-300">*</span>
                  </label>
                  <input
                    id="projectName"
                    type="text"
                    placeholder="e.g. WorkFlowX"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#080f1e] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="projectDescription"
                    className="text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="projectDescription"
                    rows="3"
                    placeholder="What is this project about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#080f1e] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="projectDeadline"
                      className="text-sm font-medium text-slate-300"
                    >
                      Deadline
                    </label>
                    <input
                      id="projectDeadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="mt-2 w-full min-w-0 rounded-xl border border-white/10 bg-[#080f1e] px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="projectStatus"
                      className="text-sm font-medium text-slate-300"
                    >
                      Status
                    </label>
                    <select
                      id="projectStatus"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#080f1e] px-3 py-3 text-sm text-white outline-none transition focus:border-blue-400/60"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Planning">Planning</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <p role="alert" className="mt-4 text-sm text-rose-300">
                  {error}
                </p>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeProjectForm}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingProject
                    ? "Save Changes"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project details modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-sm sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedProject(null);
          }}
        >
          <div className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c1528] p-5 shadow-2xl shadow-black/40 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                  Project details
                </p>
                <h2 className="mt-2 break-words text-2xl font-bold">
                  {selectedProject.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Close project details"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
              {selectedProject.description || "No description added."}
            </p>

            <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#080f1e] p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-400">Status</span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(selectedProject.status)}`}
                >
                  {selectedProject.status || "Planning"}
                </span>
              </div>

              <div className="mt-5">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="font-semibold text-blue-300">
                    {getProgress(selectedProject)}%
                  </span>
                </div>
                <div
                  className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-700"
                  role="progressbar"
                  aria-label={`${selectedProject.name} progress`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={getProgress(selectedProject)}
                >
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${getProgress(selectedProject)}%`,
                      minWidth:
                        getProgress(selectedProject) > 0 ? "4px" : "0",
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 border-t border-white/[0.07] pt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Team members
                </p>
                <p className="mt-2 break-words text-sm text-slate-200">
                  {getMemberNames(selectedProject.members)}
                </p>
              </div>

              <div className="mt-5 border-t border-white/[0.07] pt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Deadline
                </p>
                <p className="mt-2 text-sm text-slate-200">
                  {formatDeadline(selectedProject.deadline)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleEditProject(selectedProject)}
                className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                Edit Project
              </button>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
