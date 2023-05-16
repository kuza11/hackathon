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

  let stats = [
    { number: 0, time: Math.random() },
    { number: 1, time: Math.random() },
    { number: 2, time: Math.random() },
    { number: 3, time: Math.random() },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-24 text-2xl">
      <h1>Effectivity of panels over time</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stats}>
          <XAxis dataKey="number" />
          <YAxis />
          <Line type="monotone" dataKey="time" stroke="#ff0000" />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
      <div>
        <Panel name="Money lost total" value="10000" unit="Kč" />
        <Panel name="Money lost today" value="1239" unit="Kč" />
        <Panel name="Money lost from last cleaning" value="2349" unit="Kč" />
      </div>
      <button
        className="rounded-lg border-2 border-slate-400 bg-transparent px-1"
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
      <p className="text-xs">{name}:</p>
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
