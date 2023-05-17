import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Admin() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 text-2xl">
      <h1 className="mb-8">Logs from devices</h1>
      <Logs />
    </main>
  );
}

function Logs() {
  const [logs, setLogs] = useState([
    { time: 12, sens_top: 89, sens_bottom: 90, angle: 90 },
  ]);
  const router = useRouter();

  setInterval(() => {
    router.push("/admin");
  }, 1000);

  /* useEffect(() => {
    fetch("/api/live")
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, [setLogs]); */

  function objToLog(obj) {
    return `[${new Date(obj.time * 1000).toDateString()}]: top sensor: ${obj.sens_top
      }, bottom sensor: ${obj.sens_bottom}, at angle: ${obj.angle};\n`;
  }

  return (
    <textarea readOnly className="bg-slate-900 text-slate-50 w-full h-96">
      {logs.map((e) => objToLog(e))}
    </textarea>
  );
}
