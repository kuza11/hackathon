export default function Stats() {
  let stats = [
    { value: "1000", name: "Number of panels" },
    { value: "9080", name: "Price" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-2">
      {stats.map((e) => {
        return <Panel key={e.name} name={e.name} value={e.value} />;
      })}
    </main>
  );
}

function Panel({ name, value }) {
  return (
    <div>
      <p className="text-xs text-slate-600">{name}:</p>
      <p className="w-32 rounded-lg border-2 border-slate-400 px-1 text-slate-800">
        {value}
      </p>
    </div>
  );
}
