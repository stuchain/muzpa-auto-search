import { Pause, Play, SkipForward, Square, Download } from "lucide-react";
import { useRunnerStore } from "../state/useRunnerStore";

export function RunControls() {
  const { session, csvPath, loading, createSession, run, pause, resume, next, stop, exportHistory } = useRunnerStore();

  const canStart = Boolean(csvPath);
  const isRunning = session?.state === "running";
  const isPaused = session?.state === "paused";

  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="mb-4 text-lg font-semibold">Run Controls</h2>
      <p className="mb-4 text-xs text-slate-400">
        No browser automation mode: each step opens a direct Muzpa search URL in your selected browser.
      </p>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <button
          type="button"
          disabled={!canStart || loading}
          onClick={() =>
            void (async () => {
              if (session) {
                await stop();
              }
              await createSession();
              await run();
            })()
          }
          className="rounded-xl bg-gradient-to-r from-accent to-accent2 px-4 py-2 font-semibold text-black disabled:opacity-40"
        >
          <Play className="mr-2 inline" size={16} />
          {session ? "Restart Run" : "Run"}
        </button>
        <button
          type="button"
          disabled={!isRunning || loading}
          onClick={() => void pause()}
          className="rounded-xl bg-slate-700 px-4 py-2 disabled:opacity-40"
        >
          <Pause className="mr-2 inline" size={16} />
          Pause
        </button>
        <button
          type="button"
          disabled={!isPaused || loading}
          onClick={() => void resume()}
          className="rounded-xl bg-slate-700 px-4 py-2 disabled:opacity-40"
        >
          <Play className="mr-2 inline" size={16} />
          Resume
        </button>
        <button
          type="button"
          disabled={!session || loading}
          onClick={() => void stop()}
          className="rounded-xl bg-rose-700 px-4 py-2 disabled:opacity-40"
        >
          <Square className="mr-2 inline" size={16} />
          Stop
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <button
          type="button"
          disabled={!session || loading}
          onClick={() => void next("done")}
          className="rounded-xl bg-emerald-700 px-4 py-2 disabled:opacity-40"
        >
          <SkipForward className="mr-2 inline" size={16} />
          Next (Done)
        </button>
        <button
          type="button"
          disabled={!session || loading}
          onClick={() => void next("skipped")}
          className="rounded-xl bg-amber-700 px-4 py-2 disabled:opacity-40"
        >
          <SkipForward className="mr-2 inline" size={16} />
          Skip
        </button>
        <button
          type="button"
          disabled={!session || loading}
          onClick={() => void next("failed")}
          className="rounded-xl bg-rose-700 px-4 py-2 disabled:opacity-40"
        >
          <SkipForward className="mr-2 inline" size={16} />
          Fail
        </button>
        <button
          type="button"
          onClick={() => void exportHistory()}
          className="rounded-xl bg-indigo-700 px-4 py-2"
        >
          <Download className="mr-2 inline" size={16} />
          Export Logs
        </button>
      </div>
    </section>
  );
}
