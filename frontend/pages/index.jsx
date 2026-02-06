import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "48px", maxWidth: "960px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "16px" }}>
        Roofing Marketplace – Instant AI Roof Quotes
      </h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "24px", maxWidth: "640px" }}>
        Enter your address, let our AI analyze your roof from aerial imagery, and instantly compare
        quotes from vetted roofing contractors.
      </p>

      <Link href="/intake">
        <button
          style={{
            padding: "12px 24px",
            borderRadius: "999px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Get My Instant Roof Quote
        </button>
      </Link>
    </main>
  );
}
