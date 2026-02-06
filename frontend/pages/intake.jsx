import { useState } from "react";
import { useRouter } from "next/router";

export default function IntakePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    details: ""
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          details: { notes: form.details }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create lead");

      const leadId = data.lead.id;

      // Kick off roof analysis
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roof-analysis/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId })
      });

      router.push(`/results?leadId=${leadId}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "32px", maxWidth: "720px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>Tell us about your roof</h1>
      <p style={{ marginBottom: "24px" }}>
        This takes under 2 minutes. We’ll analyze your roof and generate instant quotes.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        />
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
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        />
        <input
          name="address"
          placeholder="Property Address"
          value={form.address}
          onChange={handleChange}
          required
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        />
        <textarea
          name="details"
          placeholder="Anything else we should know?"
          value={form.details}
          onChange={handleChange}
          rows={4}
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
            cursor: loading ? "default" : "pointer",
            marginTop: "8px"
          }}
        >
          {loading ? "Analyzing your roof..." : "Get My Quotes"}
        </button>
      </form>
    </main>
  );
}
