import { useRouter } from "next/router";
import RoofMap from "../components/RoofMap";

export default function ResultsPage() {
  const router = useRouter();
  const { leadId } = router.query;

  if (!leadId) return <p>Loading...</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Roof Analysis Results</h1>

      <RoofMap leadId={leadId} />

      {/* You can add quote results, contractor list, etc. below */}
    </div>
  );
}
