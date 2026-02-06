import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RoofMap from "../components/RoofMap";

export default function ResultsPage() {
  const router = useRouter();
  const { leadId } = router.query;
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  useEffect(() => {
    async function fetchQuotes() {
      if (!leadId) return;
      setLoadingQuotes(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/quotes/lead/${leadId}`
        );
        const data = await res.json();
        setQuotes(data.quotes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingQuotes(false);
      }
    }

    fetchQuotes();
  }, [leadId]);

  if (!leadId) return <p style={{ padding: "24px" }}>Loading...</p>;

  return (
    <main style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>Your Roof Analysis & Quotes</h1>

      <section style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>Roof Footprint</h2>
        <RoofMap leadId={leadId} />
      </section>

      <section>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>Contractor Quotes</h2>
        {loadingQuotes && <p>Loading quotes...</p>}
        {!loadingQuotes && quotes.length === 0 && (
          <p>No quotes yet. Try again in a moment.</p>
        )}
        <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
          {quotes.map((q) => (
            <div
              key={q.id}
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "white",
                boxShadow: "0 1px 3px rgba(15,23,42,0.08)"
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                Contractor: {q.contractor_id}
              </div>
              <div style={{ fontSize: "1.1rem", marginBottom: "4px" }}>
                Bid: ${q.amount.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                Quote ID: {q.id}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
