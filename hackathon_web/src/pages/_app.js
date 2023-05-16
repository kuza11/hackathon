import "@/styles/globals.css";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [stats, setStats] = useState([]);

  return <Component {...pageProps} stats={stats} setStats={setStats} />;
}
