
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
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
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-400">
            Sign in to continue to WorkFlowX
          </p>
        </div>

        <div className="rounded-2xl border border-blue-900/50 bg-blue-950/60 p-6 shadow-xl">
          <form onSubmit={handleLogin}>
            <div>
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
                placeholder="Enter your password"
                required
                className="mt-2 w-full rounded-lg border border-blue-900 bg-blue-950 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 block w-full rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
