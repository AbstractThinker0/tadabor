import axios from "axios";

// An axios instance that fetches data and cache it for long duration
const fetchJsonPerm = axios.create({
  baseURL: "/res",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": `max-age=31536000, immutable`,
  },
});

export default fetchJsonPerm;
