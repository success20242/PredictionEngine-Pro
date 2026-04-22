import axios from "axios";

const API = "http://localhost:5000";

export async function getPredictions() {
  const res = await axios.get(`${API}/api/predictions`);
  return res.data;
}
