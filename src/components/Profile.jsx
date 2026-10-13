
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  // Get logged-in user's information
  const token = localStorage.getItem("token");
 
const savedUser = JSON.parse(localStorage.getItem("user") || "null");
const userName = savedUser?.name || "";
const userEmail = savedUser?.email || "";


  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 rounded-lg border border-blue-800 px-4 py-2 text-sm text-gray-300 transition hover:bg-blue-900"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-2xl border border-blue-900 bg-blue-950/60 p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold">
              {(userName || userEmail || "U").charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="mt-1 text-sm text-gray-400">
                Your account information
              </p>
            </div>
          </div>

          {!token ? (
            <div className="rounded-lg border border-yellow-700/50 bg-yellow-900/20 p-4">
              <p className="text-yellow-200">
                You are not logged in.
              </p>
              <Link
                to="/login"
                className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-900 bg-slate-900/70 p-4">
                <p className="text-sm text-gray-400">Full Name</p>
                <p className="mt-1 font-medium">
                  {userName || "Name not saved yet"}
                </p>
              </div>

              <div className="rounded-xl border border-blue-900 bg-slate-900/70 p-4">
                <p className="text-sm text-gray-400">Email Address</p>
                <p className="mt-1 break-all font-medium">
                  {userEmail || "Email not saved yet"}
                </p>
              </div>

              <div className="rounded-xl border border-blue-900 bg-slate-900/70 p-4">
                <p className="text-sm text-gray-400">Account Status</p>
                <p className="mt-1 font-medium text-green-400">
                  Logged in
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
