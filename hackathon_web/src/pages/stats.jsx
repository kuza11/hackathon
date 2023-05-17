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
import stats from "../../data.json";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Stats(/*{ stats }*/) {
  let router = useRouter();

  let graph_stats = stats.message.eff_graph.graph;
  const treshold = stats.message.eff_graph.treshold;
  graph_stats = graph_stats.map((e) => {
    return {
      time: e.time,
      eff: e.eff,
      treshold,
    };
  });
  const power_graph = stats.message.power_graph;
  const moneyloss = stats.message.stats;
  const power_to_temp = stats.message.power_to_temp;

  useEffect(() => {
    if (graph_stats.at(-1).eff <= treshold) {
      toast.warn("Clean your panels!");
    }
  }, [treshold, graph_stats.last]);

  function cleaned() {
    fetch("/api/cleaning", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ unix: Math.floor(Date.now() / 1000) }),
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 text-2xl">
      <h1 className="text-5xl font-extrabold mb-8">DSSE</h1>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h1>Effectivity of panels over time</h1>
      <ResponsiveContainer height={300}>
        <LineChart data={graph_stats}>
          <XAxis dataKey="time" />
          <YAxis />
          <Line
            strokeWidth={5}
            type="monotone"
            dataKey="eff"
            stroke="#ff0000"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="treshold"
            strike="#80e64d"
            dot={false}
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>

      <button className="rounded-lg border-2 border-slate-400 bg-transparent px-1 mt-8" onClick={() => cleaned()}>I cleaned my panels</button>

      <h1 className="mt-8">Power graph</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={power_graph}>
          <XAxis dataKey="time" />
          <YAxis />
          <Line
            strokeWidth={5}
            type="monotone"
            dataKey="power"
            stroke="#ff0000"
            dot={false}
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>

      <h1 className="mt-8">Power to temperature</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={power_to_temp}>
          <XAxis dataKey="temp" />
          <YAxis domain={[90, 100]} />
          <Line
            strokeWidth={5}
            type="monotone"
            dataKey="power"
            stroke="#ff0000"
            dot={false}
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-2 mt-8">
        <Panel
          name="Money lost total"
          value={moneyloss.moneyloss_all}
          unit="Kč"
        />
        <Panel
          name="Money lost today"
          value={moneyloss.moneyloss_day}
          unit="Kč"
        />
        <Panel
          name="Money lost from last cleaning"
          value={moneyloss.moneyloss_last}
          unit="Kč"
        />
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
  const threshold = 0.25;

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
                color={time > height * (1 - threshold) ? "green" : "red"}
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
