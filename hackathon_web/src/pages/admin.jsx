import { useEffect, useState } from "react";

export default function Admin() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 text-2xl">
      <h1>Logs from devices</h1>
      <Logs />
    </main>
  );
}

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/live")
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, [setLogs]);

  function objToLog(obj) {
    return `[${obj.time}]: top sensor: ${obj.sens_top}, bottom sensor: ${obj.sens_bottom}, at angle: ${obj.angle}`;
  }

  return (
    <>
      <h1>Live logs from sensors</h1>
      <textarea className="bg-slate-600 text-slate-50">{objToLog(logs)}</textarea>
    </>
  );
}
