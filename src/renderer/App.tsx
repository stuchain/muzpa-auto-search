import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { ImportPanel } from "./components/ImportPanel";
import { ProgressPanel } from "./components/ProgressPanel";
import { RunControls } from "./components/RunControls";
import { SessionTimeline } from "./components/SessionTimeline";
import { TrackPreviewTable } from "./components/TrackPreviewTable";
import { CommandPalette } from "./components/CommandPalette";
import { useRunnerStore } from "./state/useRunnerStore";

export function App() {
  const { browser, setBrowser, hydrate, next, pause, resume } = useRunnerStore();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "enter") void next("done");
      if (key === "s") void next("skipped");
      if (key === "p") void pause();
      if (key === "r") void resume();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, pause, resume]);

  return (
    <main className="min-h-screen p-6">
      <header className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent">Muzpa Auto Search</p>
          <h1 className="mt-1 text-3xl font-bold">Track Runner Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Sparkles className="text-accent" />
          <select
            value={browser}
            onChange={(event) => setBrowser(event.target.value as typeof browser)}
            className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2"
          >
            <option value="chrome">Chrome</option>
            <option value="brave">Brave</option>
            <option value="firefox">Firefox</option>
            <option value="edge">Edge</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <ImportPanel />
          <RunControls />
          <ProgressPanel />
          <TrackPreviewTable />
        </div>
        <div className="space-y-4">
          <SessionTimeline />
        </div>
      </div>
      <CommandPalette />
    </main>
  );
}
