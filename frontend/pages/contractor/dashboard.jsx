import { useEffect, useState } from "react";

export default function ContractorDashboard() {
  const [pricing, setPricing] = useState({
    base_price_per_square: 350,
    default_material: "architectural",
    material_pricing: {
      architectural: 0,
      premium: 1500
    },
    pitch_multipliers: {
      "4": 1.0,
      "6": 1.1,
      "8": 1.25,
      "10": 1.4
    }
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // TODO: fetch existing pricing if needed
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setPricing((prev) => ({
      ...prev,
      [name]: name === "base_price_per_square" ? Number(value) : value
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contractor/pricing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(pricing)
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save pricing");
      alert("Pricing updated");
    } catch (err) {
      console.error(err);
      alert("Error saving pricing");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={{ padding: "32px", maxWidth: "720px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>Contractor Pricing</h1>
      <form onSubmit={handleSave} style={{ display: "grid", gap: "16px" }}>
        <label>
          Base price per square ($)
          <input
            name="base_price_per_square"
            type="number"
            value={pricing.base_price_per_square}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #d1d5db" }}
          />
        </label>
        <label>
          Default material
          <input
            name="default_material"
            value={pricing.default_material}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #d1d5db" }}
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "12px 24px",
            borderRadius: "999px",
            border: "none",
            background: saving ? "#9ca3af" : "#16a34a",
            color: "white",
            fontSize: "1rem",
            cursor: saving ? "default" : "pointer",
            marginTop: "8px"
          }}
        >
          {saving ? "Saving..." : "Save Pricing"}
        </button>
      </form>
    </main>
  );
}
