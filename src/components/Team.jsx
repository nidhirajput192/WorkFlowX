
import { useEffect, useState } from "react";
import api from "../api/api";

function Team() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [members, setMembers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchProjects = async () => {
    try {
      setError("");

      const response = await api.get("/projects", getConfig());
      const projectList = response.data.projects || [];

      setProjects(projectList);

      setSelectedProjectId((currentId) => {
        if (projectList.some((project) => project._id === currentId)) {
          return currentId;
        }

        return projectList[0]?._id || "";
      });
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

  const selectedProject = projects.find(
    (project) => project._id === selectedProjectId
  );

  useEffect(() => {
    setMembers(selectedProject?.members || []);
  }, [selectedProject]);

  const filteredMembers = members.filter((member) => {
    const query = searchTerm.trim().toLowerCase();

    return (
      (member.name || "").toLowerCase().includes(query) ||
      (member.email || "").toLowerCase().includes(query)
    );
  });

  const handleAddMember = async (event) => {
    event?.preventDefault();

    if (!selectedProjectId) {
      setError("Please select a project first.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter the member's email.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post(
        `/projects/${selectedProjectId}/members`,
        { email: email.trim().toLowerCase() },
        getConfig()
      );

      setEmail("");
      setIsModalOpen(false);
      setSuccess("Team member added successfully.");

      await fetchProjects();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to add team member."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this team member?"
      )
    ) {
      return;
    }

    try {
      setRemovingId(memberId);
      setError("");
      setSuccess("");

      await api.delete(
        `/projects/${selectedProjectId}/members/${memberId}`,
        getConfig()
      );

      setSuccess("Team member removed successfully.");
      await fetchProjects();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to remove team member."
      );
    } finally {
      setRemovingId("");
    }
  };

  const openModal = () => {
    setEmail("");
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-6 text-white sm:px-6 sm:py-8">

     
{/* Page Header */}
<div className="relative overflow-hidden rounded-[30px] border border-blue-900/70 bg-gradient-to-br from-blue-950 via-[#101d38] to-slate-900 px-6 py-8 shadow-xl shadow-blue-950/20 sm:px-8 sm:py-10 lg:px-10 lg:py-10">

  {/* Background Glow */}
  <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

  <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

    {/* Left Content */}
    <div className="min-w-0">

      {/* Workspace Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
        <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
        Team workspace
      </div>

      {/* Heading */}
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
        Manage Team<span className="text-blue-400">.</span>
      </h1>

      {/* Description */}
      <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100/80 sm:text-base lg:text-lg">
        Bring your team together, manage members, and collaborate
        seamlessly to achieve your project goals.
      </p>
    </div>

    {/* Right Button */}
    <div className="shrink-0">
      <button
        onClick={openModal}
        disabled={!selectedProjectId || loading}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-950/40 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-7"
      >
        <span className="text-2xl leading-none">+</span>
        Add Member
      </button>
    </div>

  </div>
</div>


      {/* Project Selector */}
      <div className="mt-7 max-w-md">
        <label
          htmlFor="team-project"
          className="text-sm text-gray-300"
        >
          Select Project
        </label>

        <select
          id="team-project"
          value={selectedProjectId}
          onChange={(event) => {
            setSelectedProjectId(event.target.value);
            setError("");
            setSuccess("");
            setSearchTerm("");
          }}
          disabled={loading || projects.length === 0}
          className="mt-2 w-full rounded-lg border border-blue-900 bg-blue-950/80 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:opacity-50"
        >
          <option value="">Select a project</option>

          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mt-5 flex items-start justify-between gap-3 rounded-lg border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-400">
          <p>{error}</p>

          <button
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="text-lg leading-none hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mt-5 flex items-start justify-between gap-3 rounded-lg border border-green-900/60 bg-green-950/30 p-4 text-sm text-green-400">
          <p>{success}</p>

          <button
            onClick={() => setSuccess("")}
            aria-label="Dismiss success"
            className="text-lg leading-none hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Team Section */}
      {loading ? (
        <p className="mt-8 text-center text-gray-400">
          Loading team members...
        </p>
      ) : projects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-blue-900/50 bg-blue-950/40 p-8 text-center">
          <h2 className="text-lg font-semibold">
            No projects found
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Create a project before adding team members.
          </p>
        </div>
      ) : (
        <>
          {/* Team Header */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {selectedProject?.name || "Project Team"}
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                {members.length} team member
                {members.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="w-full sm:max-w-xs">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name or email..."
                aria-label="Search team members"
                className="w-full rounded-lg border border-blue-900 bg-blue-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Member Cards */}
          {filteredMembers.length === 0 ? (
            <div className="mt-5 rounded-xl border border-blue-900/50 bg-blue-950/40 p-8 text-center">
              <h3 className="font-semibold">
                {members.length === 0
                  ? "No team members yet"
                  : "No matching members"}
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                {members.length === 0
                  ? "Add a registered WorkFlowX user to this project."
                  : "Try searching with another name or email."}
              </p>

              {members.length === 0 && (
                <button
                  onClick={openModal}
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
                >
                  + Add First Member
                </button>
              )}
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member, index) => (
                <div
                  key={member._id}
                  className="rounded-2xl border border-blue-900/50 bg-blue-950/60 p-6 transition hover:border-blue-700/70 hover:bg-blue-950/80"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                        [
                          "bg-blue-600",
                          "bg-purple-600",
                          "bg-green-600",
                        ][index % 3]
                      } text-lg font-bold`}
                    >
                      {member.name?.charAt(0).toUpperCase() || "?"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {member.name || "Unnamed Member"}
                      </h3>

                      <p className="mt-1 break-all text-sm text-gray-400">
                        {member.email || "No email available"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                      Team Member
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteMember(member._id)}
                    disabled={removingId === member._id}
                    className="mt-5 w-full rounded-lg border border-red-900/60 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {removingId === member._id
                      ? "Removing..."
                      : "Remove Member"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-blue-900/50 bg-blue-950 p-6 shadow-2xl">

            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Add Team Member
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Add a registered user to your project.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!saving) setIsModalOpen(false);
                }}
                disabled={saving}
                aria-label="Close modal"
                className="text-xl text-gray-400 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddMember}>
              <div className="mt-6">
                <label
                  htmlFor="member-email"
                  className="text-sm text-gray-300"
                >
                  Registered User Email
                </label>

                <input
                  id="member-email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter registered email"
                  className="mt-2 w-full rounded-lg border border-blue-900 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
                />

                <p className="mt-2 text-xs text-gray-400">
                  The user must already have a WorkFlowX account.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!saving) setIsModalOpen(false);
                  }}
                  disabled={saving}
                  className="rounded-lg border border-blue-800 px-5 py-3 font-semibold text-gray-300 hover:bg-blue-900/40 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !email.trim()}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Team;