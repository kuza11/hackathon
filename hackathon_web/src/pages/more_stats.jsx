import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import stats from "../../data.json";
import { useRouter } from "next/router";

export default function Stats() {
  const router = useRouter();
  const moneyloss = stats.message.stats;
  const power_to_temp = stats.message.power_to_temp;

  return (
    <main className="flex min-h-screen flex-col items-center p-16 text-2xl">
      <h1 className="mt-8">Power to temperature</h1>
      <ResponsiveContainer width="100%" height={250}>
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
        onClick={() => router.push("/stats")}
      >
        Go back to statistics
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
