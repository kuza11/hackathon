import { useRouter } from "next/router";
import { useEffect, useState } from "react";

async function getData() {
  const res = await fetch("/api/live");
  const data = await res.json();
  return data;
}

export default function Admin() {
  return (
    <main className="flex min-h-screen flex-col items-center p-16 text-2xl">
      <h1 className="text-5xl font-extrabold mb-8">DSSE</h1>
      <h1 className="mb-8">Logs from devices</h1>
      <Logs />
    </main>
  );
}

function Logs() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      let resp = await getData();
      //console.log(resp);
      setData(resp);
      //console.log(data);
    }, 1000); // fetch every 5000 milliseconds (5 seconds)

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <>
      <div className="bg-slate-900 text-slate-50 w-full h-96 whitespace-pre-wrap">
        {data &&
          data.message
            .filter(
              (e) =>
                e.mac == "B8:D6:1A:47:D7:A8" || e.mac == "B8:D6:1A:43:88:A8"
            )
            .slice(0, 2)
            .map((e) => {
              return `     MAC address: ${e.mac}     time: ${new Date(
                e.time * 1000
              ).toLocaleString()}     temperature: ${parseFloat(
                e.temperature
              )}˚C     angle: ${parseFloat(e.angle).toFixed(
                2
              )}°     sensor A: ${parseFloat(e.sens_bottom).toFixed(
                2
              )} lux     sensor B: ${parseFloat(e.sens_top).toFixed(2)} lux \n`;
            })}
      </div>
      <button
        className="rounded-lg border-2 border-slate-400 bg-transparent px-1 mt-8"
        onClick={() => router.push("/stats")}
      >
        Go back to statistics
      </button>
    </>
  );
}
