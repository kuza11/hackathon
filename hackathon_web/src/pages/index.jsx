import { useRouter } from "next/router";
import { useState } from "react";

export default function Home({ setStats }) {
  const [panelInfo, setPanelInfo] = useState({ panel_count: null, power_per_panel: null });
  const router = useRouter();

  async function sendPanelInfo(panelInfo) {
    const res = await fetch("/api/graph", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(panelInfo),
    });

    return await res.json();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // setStats(await sendPanelInfo(panelInfo));
    router.push("/stats");
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4 text-2xl">
      <h1 className="text-5xl font-extrabold mb-8">DSSE</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          className="rounded-lg border-2 border-slate-400 bg-transparent px-1"
          placeholder="Number of panels you have"
          onChange={(e) =>
            setPanelInfo({ panel_count: e.target.value, power_per_panel: panelInfo.power_per_panel })
          }
          value={panelInfo.panel_count}
        />
        <input
          className="rounded-lg border-2 border-slate-400 bg-transparent px-1"
          placeholder="Max power per one panel [W]"
          onChange={(e) =>
            setPanelInfo({ power_per_panel: e.target.value, panel_count: panelInfo.panel_count })
          }
          value={panelInfo.power_per_panel}
        />
        <button className="rounded-lg border-2 border-slate-400 bg-transparent px-1">
          Calculate
        </button>
      </form>
    </main>
  );
}
