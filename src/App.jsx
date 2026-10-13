
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Contact from "./components/Contact";

import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Projects from "./components/Projects";
import Tasks from "./components/Tasks";
import Team from "./components/Team";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import About from "./components/About";
import Profile from "./components/Profile";

function Home() {
  return (
    <div className="min-h-screen bg-blue-950">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Contact />
      <CTA />
      <Footer />
    </div>
  );
}

// Login check for private pages
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
