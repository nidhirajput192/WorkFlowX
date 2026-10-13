
import { useEffect, useState } from "react";

function Settings() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklySummary: false,
  });

  // Load user and saved preferences
  useEffect(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (!savedUser) {
        setError("Please log in to access account settings.");
      } else {
        setUser(savedUser);
        setName(savedUser.name || "");
      }

      const savedPreferences = JSON.parse(
        localStorage.getItem("workflowx-settings") || "null"
      );

      if (savedPreferences) {
        setPreferences((prev) => ({
          ...prev,
          ...savedPreferences,
        }));
      }
    } catch {
      setError("Unable to load your account settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Save profile and preferences
  const handleSave = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in again to save your changes.");
      return;
    }

    if (!name.trim()) {
      setError("Full name cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: name.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update profile."
        );
      }

      const updatedUser = {
        ...user,
        ...(data.user || {}),
        name: data.user?.name || name.trim(),
      };

      setUser(updatedUser);
      setName(updatedUser.name);

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem(
        "workflowx-settings",
        JSON.stringify(preferences)
      );

      setMessage("Your settings have been saved successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setMessage("");
    setError("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-5 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-[30px] border border-blue-900/70 bg-gradient-to-br from-blue-950 via-[#101d38] to-slate-900 p-8 sm:p-10">
          <div className="h-8 w-40 animate-pulse rounded-full bg-blue-900/50" />
          <div className="mt-6 h-12 max-w-sm animate-pulse rounded-lg bg-blue-900/40" />
          <p className="mt-5 text-sm text-gray-400">
            Loading your settings...
          </p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "My Profile", icon: "◉", href: "#profile" },
    { label: "Notifications", icon: "♧", href: "#notifications" },
    { label: "Workspace", icon: "⚙", href: "#workspace" },
  ];

  const notificationItems = [
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description: "Your preference for receiving email updates.",
    },
    {
      key: "taskReminders",
      title: "Task Reminders",
      description: "Your preference for task reminder notifications.",
    },
    {
      key: "weeklySummary",
      title: "Weekly Summary",
      description: "Your preference for a weekly activity summary.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-6 text-white sm:px-6 sm:py-8 lg:px-8">

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-[30px] border border-blue-900/70 bg-gradient-to-br from-blue-950 via-[#101d38] to-slate-900 px-6 py-8 shadow-xl shadow-blue-950/20 sm:px-8 sm:py-10 lg:px-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
            Account preferences
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Account Settings
            <span className="text-blue-400">.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100/80 sm:text-base lg:text-lg">
            Manage your profile, customize your notification preferences,
            and keep your WorkFlowX account up to date.
          </p>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">

        {/* Settings Navigation */}
        <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Settings menu
          </p>

          {menuItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                index === 0
                  ? "border border-blue-500/20 bg-blue-600/15 text-blue-300"
                  : "text-slate-300 hover:bg-blue-950/60 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </aside>

        {/* Settings Content */}
        <form onSubmit={handleSave} className="min-w-0 space-y-6">

          {/* Profile Section */}
          <section
            id="profile"
            className="scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7"
          >
            <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-2xl font-bold shadow-lg shadow-blue-950/50">
                {(name.trim() || "U").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Update the name associated with your account.
                </p>
              </div>

              <span className="w-fit rounded-full border border-emerald-800/60 bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-400 sm:ml-auto">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                Account active
              </span>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-slate-300"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setMessage("");
                    setError("");
                  }}
                  placeholder="Enter your full name"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-300"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  readOnly
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-400 outline-none"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Email changes are currently disabled.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-sm font-medium text-slate-300">
                Registered account email
              </p>

              <p className="mt-1 break-all text-sm text-slate-400">
                {user.email || "Not available"}
              </p>
            </div>
          </section>

          {/* Notification Preferences */}
          <section
            id="notifications"
            className="scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-300">
                ♧
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Notification Preferences
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Choose the notification preferences you want to keep.
                </p>
              </div>
            </div>

            <div className="mt-5 divide-y divide-slate-800">
              {notificationItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-200">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences[item.key]}
                    aria-label={item.title}
                    onClick={() => togglePreference(item.key)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      preferences[item.key]
                        ? "bg-blue-600"
                        : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                        preferences[item.key]
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              These preferences are saved in this browser when you select
              Save Changes. Actual email delivery or scheduled reminders
              require backend support.
            </p>
          </section>

          {/* Workspace Section */}
          <section
            id="workspace"
            className="scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-300">
                ⚙
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Workspace Preferences
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  General information about your WorkFlowX workspace.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Workspace
                </p>

                <p className="mt-3 font-semibold text-slate-200">
                  WorkFlowX
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Team project management
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Appearance
                </p>

                <p className="mt-3 font-semibold text-slate-200">
                  Dark Theme
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Current interface appearance
                </p>
              </div>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div
              role="status"
              className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-4 text-sm text-emerald-300"
            >
              {message}
            </div>
          )}

          {/* Save Changes */}
          <div className="flex flex-col gap-4 rounded-2xl border border-blue-900/50 bg-gradient-to-br from-blue-950/70 to-slate-900 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="font-semibold text-white">
                Save your changes
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Update your profile and save your preferences.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
              {!saving && <span>→</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
