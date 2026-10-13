


import { useEffect, useState } from "react";
import api from "../api/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("High");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [projectId, setProjectId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Backend ke task ko UI ke liye readable banao.
  // Original assignedTo object preserve karna zaroori hai for editing.
  const formatTask = (task) => ({
    ...task,
    name: task.title,
    status: task.status === "Done" ? "Completed" : task.status,
    assignedName: task.assignedTo?.name || "Unassigned",
    deadline: task.dueDate ? task.dueDate.slice(0, 10) : "",
    projectName:
      typeof task.project === "object"
        ? task.project?.name || "Project"
        : "Project",
  });

  const fetchData = async () => {
    try {
      setError("");

      const [taskResponse, projectResponse] = await Promise.all([
        api.get("/tasks", getConfig()),
        api.get("/projects", getConfig()),
      ]);

      setTasks((taskResponse.data.tasks || []).map(formatTask));
      setProjects(projectResponse.data.projects || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setTaskName("");
    setDescription("");
    setPriority("High");
    setAssignedTo("");
    setDeadline("");
    setProjectId("");
    setEditingTaskId(null);
    setIsModalOpen(false);
  };

  const openCreateForm = () => {
    resetForm();
    setError("");
    setIsModalOpen(true);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!taskName.trim()) {
      setError("Please enter a task name.");
      return;
    }

    if (!projectId) {
      setError("Please select a project.");
      return;
    }

    try {
      setError("");
      setSaving(true);

      const taskData = {
        title: taskName.trim(),
        description: description.trim(),
        priority,
        status: "To Do",
        projectId,
        assignedTo: assignedTo || null,
        dueDate: deadline || null,
      };

      if (editingTaskId) {
        await api.put(
          `/tasks/${editingTaskId}`,
          {
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            assignedTo: taskData.assignedTo,
            dueDate: taskData.dueDate,
          },
          getConfig()
        );
      } else {
        await api.post("/tasks", taskData, getConfig());
      }

      resetForm();
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save task."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setError("");

      const backendStatus =
        newStatus === "Completed" ? "Done" : newStatus;

      await api.put(
        `/tasks/${taskId}`,
        { status: backendStatus },
        getConfig()
      );

      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update task status."
      );
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/tasks/${taskId}`, getConfig());

      setTasks((prev) =>
        prev.filter((task) => task._id !== taskId)
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete task."
      );
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setTaskName(task.title || "");
    setDescription(task.description || "");
    setPriority(task.priority || "Medium");
    setAssignedTo(
      typeof task.assignedTo === "object"
        ? task.assignedTo?._id || ""
        : ""
    );
    setDeadline(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setProjectId(
      typeof task.project === "object"
        ? task.project?._id || ""
        : task.project || ""
    );
    setError("");
    setIsModalOpen(true);
  };

  const selectedProject = projects.find(
    (project) => project._id === projectId
  );

  const assignees = selectedProject
    ? [
        ...(selectedProject.owner ? [selectedProject.owner] : []),
        ...(selectedProject.members || []),
      ].filter(
        (member, index, arr) =>
          member?._id &&
          arr.findIndex(
            (item) => item._id === member._id
          ) === index
      )
    : [];

  const getPriorityStyle = (value) => {
    switch (value) {
      case "High":
        return "border-rose-400/20 bg-rose-400/10 text-rose-300";
      case "Medium":
        return "border-amber-400/20 bg-amber-400/10 text-amber-200";
      case "Low":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
      default:
        return "border-slate-400/20 bg-slate-400/10 text-slate-300";
    }
  };

  const getStatusStyle = (value) => {
    switch (value) {
      case "Completed":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
      case "In Progress":
        return "border-blue-400/20 bg-blue-400/10 text-blue-300";
      default:
        return "border-slate-400/20 bg-slate-400/10 text-slate-300";
    }
  };

  const isOverdue = (task) =>
    task.status !== "Completed" &&
    task.deadline &&
    new Date(`${task.deadline}T00:00:00`) <
      new Date(new Date().toDateString());

  const filteredTasks = tasks.filter((task) => {
    const term = search.toLowerCase();

    const matchesSearch = [
      task.name,
      task.description,
      task.projectName,
      task.assignedName,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const activeCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const overdueCount = tasks.filter(isOverdue).length;

  return (
    <div className="min-h-screen bg-[#070d1a] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <main className="mx-auto max-w-7xl">
        {/* Hero heading */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-[#14264a] via-[#101d38] to-[#0c1426] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/[0.08] px-3 py-1.5 text-xs font-medium text-blue-200">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Team workspace
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Manage Tasks<span className="text-blue-400">.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Stay organized, track progress, and keep your team
                moving toward its goals.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:bg-blue-400 sm:w-auto"
            >
              <span className="text-xl leading-none">+</span>
              Add Task
            </button>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-rose-400/20 bg-rose-500/[0.07] px-4 py-3 text-sm text-rose-300"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-lg leading-none"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Summary */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Tasks",
              value: tasks.length,
              icon: "▦",
              color: "text-blue-300",
              bg: "bg-blue-500/15",
            },
            {
              label: "In Progress",
              value: activeCount,
              icon: "↗",
              color: "text-cyan-300",
              bg: "bg-cyan-500/15",
            },
            {
              label: "Completed",
              value: completedCount,
              icon: "✓",
              color: "text-emerald-300",
              bg: "bg-emerald-500/15",
            },
            {
              label: "Overdue",
              value: overdueCount,
              icon: "!",
              color: "text-rose-300",
              bg: "bg-rose-500/15",
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
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bg} ${item.color} text-2xl font-bold`}
                aria-hidden="true"
              >
                {item.icon}
              </div>
            </article>
          ))}
        </section>

        {/* Search and filters */}
        <section className="mt-9">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                All Tasks
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading your tasks..."
                  : `${filteredTasks.length} of ${tasks.length} tasks`}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                aria-label="Search tasks"
                className="w-full rounded-xl border border-white/10 bg-[#0c1425] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/50 sm:w-52"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="w-full rounded-xl border border-white/10 bg-[#0c1425] px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-400/50"
              >
                <option value="All">All statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter by priority"
                className="w-full rounded-xl border border-white/10 bg-[#0c1425] px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-400/50"
              >
                <option value="All">All priorities</option>
                <option value="High">High priority</option>
                <option value="Medium">Medium priority</option>
                <option value="Low">Low priority</option>
              </select>
            </div>
          </div>

          {/* Task list */}
          {loading ? (
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-white/[0.07] bg-[#0c1425] p-6"
                >
                  <div className="h-5 w-1/2 rounded bg-white/10" />
                  <div className="mt-4 h-3 w-3/4 rounded bg-white/[0.06]" />
                  <div className="mt-8 h-10 rounded-xl bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-blue-300">
                +
              </div>
              <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
              <p className="mt-2 text-sm text-slate-400">
                Create your first task to get started.
              </p>
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold hover:bg-blue-400"
              >
                Add your first task
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center">
              <p className="font-semibold text-slate-200">
                No matching tasks
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Try changing your search or filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setPriorityFilter("All");
                }}
                className="mt-4 text-sm font-semibold text-blue-300 hover:text-blue-200"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredTasks.map((task) => (
                <article
                  key={task._id}
                  className="rounded-2xl border border-white/[0.08] bg-[#0c1425] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-400/25 hover:bg-[#0e192d] sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-lg font-bold text-blue-300">
                      {(task.name || "T").charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-lg font-semibold text-slate-100">
                        {task.name}
                      </h3>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
                        {task.description || "No description added."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${getPriorityStyle(task.priority)}`}
                    >
                      {task.priority || "Medium"} Priority
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(task.status)}`}
                    >
                      {task.status}
                    </span>

                    {isOverdue(task) && (
                      <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-medium text-rose-300">
                        Overdue
                      </span>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Assigned to
                      </p>
                      <p className="mt-2 break-words text-sm text-slate-300">
                        {task.assignedName}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Deadline
                      </p>
                      <p
                        className={`mt-2 text-sm ${
                          isOverdue(task)
                            ? "font-medium text-rose-300"
                            : "text-slate-300"
                        }`}
                      >
                        {task.deadline || "Not set"}
                      </p>
                    </div>

                    <div className="min-w-0 sm:col-span-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Project
                      </p>
                      <p className="mt-2 break-words text-sm text-slate-300">
                        {task.projectName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <label
                        htmlFor={`status-${task._id}`}
                        className="mb-2 block text-xs text-slate-500"
                      >
                        Update status
                      </label>
                      <select
                        id={`status-${task._id}`}
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#080f1e] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400/50 sm:w-44"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditTask(task)}
                        className="rounded-xl border border-blue-400/20 px-3 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/10"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task._id)}
                        className="rounded-xl border border-rose-400/15 px-3 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/[0.08]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-white/[0.06] py-5 text-center text-xs text-slate-600">
          WorkFlowX · Plan, assign, track, collaborate, complete.
        </footer>
      </main>

      {/* Create / Edit task modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur-sm sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) resetForm();
          }}
        >
          <div className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c1528] p-5 shadow-2xl shadow-black/40 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                  Task workspace
                </p>
                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  {editingTaskId ? "Edit Task" : "Create New Task"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Add the details needed to get work moving.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Close task form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTask}>
              <div className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="taskName"
                    className="text-sm font-medium text-slate-300"
                  >
                    Task Name <span className="text-blue-300">*</span>
                  </label>
                  <input
                    id="taskName"
                    type="text"
                    placeholder="e.g. Create Login UI"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#080f1e] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="taskDescription"
                    className="text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="taskDescription"
                    rows="3"
                    placeholder="Describe the task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#080f1e] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="taskProject"
                    className="text-sm font-medium text-slate-300"
                  >
                    Project <span className="text-blue-300">*</span>
                  </label>
                  <select
                    id="taskProject"
                    value={projectId}
                    onChange={(e) => {
                      setProjectId(e.target.value);
                      setAssignedTo("");
                    }}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#080f1e] px-4 py-3 text-white outline-none focus:border-blue-400/60"
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="taskPriority"
                      className="text-sm font-medium text-slate-300"
                    >
                      Priority
                    </label>
                    <select
                      id="taskPriority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#080f1e] px-4 py-3 text-white outline-none focus:border-blue-400/60"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="taskAssignee"
                      className="text-sm font-medium text-slate-300"
                    >
                      Assign To
                    </label>
                    <select
                      id="taskAssignee"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#080f1e] px-4 py-3 text-white outline-none focus:border-blue-400/60"
                    >
                      <option value="">Unassigned</option>
                      {assignees.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                    {projectId && assignees.length === 0 && (
                      <p className="mt-2 text-xs text-slate-500">
                        No team members are available for this project.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="taskDeadline"
                    className="text-sm font-medium text-slate-300"
                  >
                    Deadline
                  </label>
                  <input
                    id="taskDeadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#080f1e] px-4 py-3 text-white outline-none focus:border-blue-400/60"
                  />
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
                  onClick={resetForm}
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
                    : editingTaskId
                    ? "Save Changes"
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
