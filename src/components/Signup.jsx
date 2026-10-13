
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 px-6 py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Create Your Account
          </h1>

          <p className="mt-2 text-gray-400">
            Join your team on WorkFlowX
          </p>
        </div>

        <div className="rounded-2xl border border-blue-900/50 bg-blue-950/60 p-6 shadow-xl">
          <form onSubmit={handleSignup}>
            <div>
              <label className="text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="mt-2 w-full rounded-lg border border-blue-900 bg-blue-950 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-2 w-full rounded-lg border border-blue-900 bg-blue-950 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                minLength={8}
                required
                className="mt-2 w-full rounded-lg border border-blue-900 bg-blue-950 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                minLength={8}
                required
                className="mt-2 w-full rounded-lg border border-blue-900 bg-blue-950 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="mt-4 text-sm text-green-400">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Signup;
