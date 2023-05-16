import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const [showGraph, setShowGraph] = useState(false);
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4 text-2xl">
      <Input
        content="Location"
        buttonContent="Calculate"
        onClick={() => setShowGraph(true)}
      />
      {showGraph && <Graph height={300} />}
      <Input
        content="Number of panels"
        buttonContent="Show statistics"
        onClick={() => router.push("/stats")}
      />
    </main>
  );
}

function Input({ content, buttonContent, onClick }) {
  return (
    <>
      <input
        className="rounded-lg border-2 border-slate-400 bg-transparent px-1"
        placeholder={content}
      />
      <button
        className="rounded-lg border-2 border-slate-400 bg-transparent px-1"
        onClick={onClick}
      >
        {buttonContent}
      </button>
    </>
  );
}

function Graph({ height }) {
  let stats = [
    { time: 10, number: 0, worth: true },
    { time: 20, number: 1, worth: false },
  ];

  let max = stats.reduce((a, b) => Math.max(a.time, b.time), 0);
  console.log(max);

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

function map(val, inMin, inMax, outMin, outMax) {
  return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
