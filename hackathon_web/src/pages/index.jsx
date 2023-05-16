import { useRouter } from "next/router";
import { useState } from "react";

export default function Home({ stats, setStats }) {
  const [location, setLocation] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const router = useRouter();

  async function sendLocation(location) {
    const res = await fetch("/api/graph", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ location: location }),
    });

    return await res.json();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStats(await sendLocation(location));
    setShowGraph(true);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4 text-2xl">
      <form onSubmit={handleSubmit}>
        <input
          className="rounded-lg border-2 border-slate-400 bg-transparent px-1"
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
          value={location}
        />
        <button className="rounded-lg border-2 border-slate-400 bg-transparent px-1">
          Calculate
        </button>
      </form>

      {showGraph && (
        <>
          <Graph stats={stats} height={300} />
          <input
            className="rounded-lg border-2 border-slate-400 bg-transparent px-1"
            placeholder="Pick a number of panels"
          />
          <button
            className="rounded-lg border-2 border-slate-400 bg-transparent px-1"
            onClick={() => router.push("/stats")}
          >
            Show statistics
          </button>
        </>
      )}
    </main>
  );
}

function Graph({ stats, height }) {
  let max = stats.reduce((maxTime, current) => {
    return current.time > maxTime ? current.time : maxTime;
  }, 0);

  function map(val, inMin, inMax, outMin, outMax) {
    return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  return (
    <>
      <p>Graph</p>
      <div
        className="flex items-end gap-1 w-full overflow-x-scroll justify-center border-2 border-slate-400"
        style={{ height }}
      >
        {stats.map((e) => (
          <Node
            key={e.number}
            color={e.worth ? "green" : "red"}
            height={map(e.time, 0, max, 0, height)}
          />
        ))}
      </div>
    </>
  );
}

function Node({ color, height }) {
  return <div style={{ height, backgroundColor: color, minWidth: "20px" }} />;
}
