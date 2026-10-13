import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanks for reaching out! Contact form demo submitted.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="bg-slate-950 px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

        {/* Contact Information */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Contact Us
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Let's build better
            <span className="block text-blue-400">workflows together.</span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
            Have a question, suggestion, or idea to improve team collaboration?
            Send us a message using the form.
          </p>

          <div className="mt-8 rounded-2xl border border-blue-900/50 bg-blue-950/60 p-5 sm:p-6">
            <p className="font-semibold text-white">
              WorkFlowX
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              One workspace for planning, task management, and team progress.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-blue-900/50 bg-blue-950/60 p-5 sm:p-7"
        >
          <h3 className="text-xl font-semibold text-white">
            Send us a message
          </h3>

          <div className="mt-6 space-y-5">

            <div>
              <label className="text-sm font-medium text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your name"
                className="mt-2 w-full rounded-lg border border-blue-900 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                className="mt-2 w-full rounded-lg border border-blue-900 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">
                Message
              </label>

              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="How can we help?"
                className="mt-2 w-full resize-y rounded-lg border border-blue-900 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            Send Message
          </button>
        </form>

      </div>
    </section>
  );
}

export default Contact;