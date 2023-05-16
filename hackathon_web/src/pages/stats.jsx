import { useRouter } from "next/router";

export default function Stats(/*{ stats }*/) {
  let router = useRouter();

  let stats = [
    { value: "9080", name: "Price", unit: "$" },
    { value: "10", name: "Time to evaluation", unit: "days" },
    { value: "1000", name: "Power per year", unit: "W/year" },
    { value: "800", name: "Income per month", unit: "$" },
    { value: "5", name: "Number of panels", unit: "panels" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-8 text-2xl">
      {stats.map((e) => (
        <Panel key={e.name} e={e} />
      ))}
      <button
        className="rounded-lg border-2 border-slate-400 bg-transparent px-1"
        onClick={() => router.push("/admin")}
      >
        See the logs
      </button>
    </main>
  );
}

function Panel({ e: { name, value, unit } }) {
  return (
    <div>
      <p className="text-xs">{name}:</p>
      <p className="w-64 rounded-lg border-2 border-slate-400 px-1 text-slate-800">
        {value} {unit}
      </p>
    </div>
  );
}
