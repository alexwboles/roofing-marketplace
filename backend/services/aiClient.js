import axios from "axios";

export async function analyzeRoof(address) {
  const url = `${process.env.AI_SERVICE_URL}/analyze`;
  const response = await axios.post(url, { address });
  return response.data;
}
