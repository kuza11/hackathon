import { useRouter } from "next/router";

export default function Stats({ stats }) {
  let router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-8 text-2xl">
      {stats.map((e) => (
        <Panel key={e.name} name={e.name} value={e.value} unit={e.unit} />
      ))}
      <button onClick={() => router.push("/admin")}>See the logs</button>
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
