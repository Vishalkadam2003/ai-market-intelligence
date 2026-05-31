import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch(
        "https://ai-market-intelligence-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail)
        );
        return;
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      navigate("/dashboard");

    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <input
          type="email"
          className="w-full mb-4 border rounded px-4 py-2 bg-gray-800 text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 border rounded px-4 py-2 bg-gray-800 text-white"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-700 text-white py-3 rounded-xl"
        >
          Login
        </button>

        <p className="text-center mt-5 text-sm text-white">
          No account?{" "}
          <Link
            className="text-blue-400"
            to="/signup"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
