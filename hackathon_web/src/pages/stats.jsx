import { useRouter } from "next/router";
import Graph_css from "../styles/Graph.module.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Stats(/*{ stats }*/) {
  let router = useRouter();

  let graph_stats = [
    { time: 0, eff: 100 },
    { time: 1, eff: 98 },
    { time: 2, eff: 95 },
    { time: 3, eff: 93 },
    { time: 4, eff: 92 },
    { time: 5, eff: 90 },
    { time: 6, eff: 87 },
    { time: 7, eff: 88 },
    { time: 8, eff: 85 },
    { time: 9, eff: 84 },
    { time: 10, eff: 82 },
    { time: 11, eff: 80 },
    { time: 12, eff: 80 },
    { time: 13, eff: 80 },
    { time: 14, eff: 76 },
    { time: 15, eff: 72 },
    { time: 16, eff: 69 },
    { time: 17, eff: 69 },
    { time: 18, eff: 89 },
    { time: 19, eff: 86 },
    { time: 20, eff: 82 },
    { time: 21, eff: 80 },
    { time: 22, eff: 79 },
    { time: 23, eff: 77 },
    { time: 24, eff: 74 },
    { time: 25, eff: 72 },
    { time: 26, eff: 68 },
    { time: 27, eff: 63 },
    { time: 28, eff: 63 },
    { time: 29, eff: 60 },
    { time: 30, eff: 58 },
    { time: 31, eff: 69 },
    { time: 32, eff: 69 },
    { time: 33, eff: 68 },
    { time: 34, eff: 65 },
    { time: 35, eff: 62 },
    { time: 36, eff: 61 },
    { time: 37, eff: 60 },
    { time: 38, eff: 59 },
    { time: 39, eff: 57 },
    { time: 40, eff: 54 },
    { time: 41, eff: 54 },
    { time: 42, eff: 53 },
    { time: 43, eff: 65 },
    { time: 44, eff: 64 },
    { time: 45, eff: 62 },
    { time: 46, eff: 61 },
    { time: 47, eff: 60 },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-24 text-2xl">
      <h1>Effectivity of panels over time</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={graph_stats}>
          <XAxis dataKey="time" />
          <YAxis />
          <Line type="monotone" dataKey="eff" stroke="#ff0000" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-8">
        <Panel name="Money lost total" value="10000" unit="Kč" />
        <Panel name="Money lost today" value="1239" unit="Kč" />
        <Panel name="Money lost from last cleaning" value="2349" unit="Kč" />
      </div>
      <button
        className="rounded-lg border-2 border-slate-400 bg-transparent px-1 mt-8"
        onClick={() => router.push("/admin")}
      >
        See the logs
      </button>
    </main>
  );
}

function Panel({ name, value, unit }) {
  return (
    <div>
      <p className="text-lg">{name}:</p>
      <p className="w-64 rounded-lg border-2 border-slate-400 px-1 text-slate-800">
        {value} {unit}
      </p>
    </div>
  );
}

function Graph({ name, unit1, unit2, stats, height, setNumPanels }) {
  const router = useRouter();
  const threshhold = 0.25;

  let max = stats.reduce((maxTime, current) => {
    return current.time > maxTime ? current.time : maxTime;
  }, 0);

  function map(val, inMin, inMax, outMin, outMax) {
    return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  return (
    <>
      <p>{name}</p>
      <div className={`w-full ${Graph_css.graphContainer}`}>
        <p className={`text-xs ${Graph_css.unit1}`}>{unit1}</p>
        <p className={`text-xs ${Graph_css.unit2}`}>{unit2}</p>
        <div
          className={`flex flex-row-reverse items-end gap-1 max-w-full overflow-x-auto border-2 border-slate-400 ${Graph_css.graph}`}
          style={{ height }}
        >
          {stats.map((e) => {
            let time = map(e.time, 0, max, 0, height);
            return (
              <Node
                key={e.number}
                color={time > height * (1 - threshhold) ? "green" : "red"}
                height={time}
                onClick={() => {
                  setNumPanels(e.number);
                  router.push("/stats");
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function Node({ color, height }) {
  return <div style={{ height, backgroundColor: color, minWidth: "20px" }} />;
}
