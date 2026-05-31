import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [full_name, setName] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    setError(""); setSuccess("");

    try {
      const res = await fetch("https://ai-market-intelligence-backend.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: full_name,
          email,
          password
        }),

      const data = await res.json();

      if (!res.ok) {
        setError(
  typeof data.detail === "string"
    ? data.detail
    : JSON.stringify(data.detail)
);
        return;
      }

      setSuccess("Account created");
      setTimeout(() => navigate("/login"), 1000);

    } catch (err) {
      setError("Something went wrong");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">Signup</h2>

        {error && <p className="text-red-600 text-center mb-3">{error}</p>}
        {success && <p className="text-green-600 text-center mb-3">{success}</p>}

        <input
          className="w-full mb-4 border rounded px-4 py-2"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-4 border rounded px-4 py-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 border rounded px-4 py-2"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-700 text-white py-3 rounded-xl"
        >
          Create Account
        </button>

        <p className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <Link className="text-blue-700" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
