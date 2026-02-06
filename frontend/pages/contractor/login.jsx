import { useState } from "react";

export default function ContractorLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      window.location.href = "/contractor/dashboard";
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "32px", maxWidth: "480px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>Contractor Login</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 24px",
            borderRadius: "999px",
            border: "none",
            background: loading ? "#9ca3af" : "#2563eb",
            color: "white",
            fontSize: "1rem",
            cursor: loading ? "default" : "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
