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
    <main className="flex min-h-screen flex-col items-center p-16 text-2xl">
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
      <ResponsiveContainer height={250}>
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

      <button
        className="rounded-lg border-2 border-slate-400 bg-transparent px-1 mt-8"
        onClick={() => cleaned()}
      >
        I cleaned my panels
      </button>

      <h1 className="mt-8">Power graph</h1>
      <ResponsiveContainer width="100%" height={250}>
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

      <div className="flex flex-row gap-8 items-center mt-8">
        <button
          className="rounded-lg border-2 border-slate-400 bg-transparent px-1 mt-8"
          onClick={() => router.push("/admin")}
        >
          See the logs
        </button>
        <button
          className="rounded-lg border-2 border-slate-400 bg-transparent px-1 mt-8"
          onClick={() => router.push("/more_stats")}
        >
          See all statisctics
        </button>
      </div>
    </main>
  );
}
