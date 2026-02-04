import axios from "axios";

export async function analyzeRoof(address) {
  const response = await axios.post(
    process.env.AI_SERVICE_URL + "/analyze",
    { address }
  );
  return response.data;
}
