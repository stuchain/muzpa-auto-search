import { motion } from "framer-motion";
import { useRunnerStore } from "../state/useRunnerStore";

export function ProgressPanel() {
  const { progress, session } = useRunnerStore();
  const current = session?.rows[session.currentIndex];
  const elapsedMs = session ? Date.now() - new Date(session.startedAt).getTime() : 0;
  const avgMs = progress.done > 0 ? Math.round(elapsedMs / progress.done) : 0;
  const etaMs = avgMs * progress.pending;
  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Progress</h2>
        <span className="rounded-lg bg-accent/20 px-2 py-1 text-xs text-accent">{session?.state ?? "idle"}</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent2"
          animate={{ width: `${progress.percent}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>
      <p className="mt-2 text-sm text-slate-300">{progress.percent}% complete</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm xl:grid-cols-5">
        <Stat label="Total" value={progress.total} />
        <Stat label="Done" value={progress.done} />
        <Stat label="Skipped" value={progress.skipped} />
        <Stat label="Failed" value={progress.failed} />
        <Stat label="Pending" value={progress.pending} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <div className="rounded-xl bg-slate-900/70 p-3">
          <p className="text-xs text-slate-400">Current Search</p>
          <p className="text-sm font-semibold">{current ? `${current.track} - ${current.artist}` : "None"}</p>
        </div>
        <div className="rounded-xl bg-slate-900/70 p-3">
          <p className="text-xs text-slate-400">Avg Track Time</p>
          <p className="text-sm font-semibold">{avgMs ? `${Math.round(avgMs / 1000)}s` : "--"}</p>
        </div>
        <div className="rounded-xl bg-slate-900/70 p-3">
          <p className="text-xs text-slate-400">Projected ETA</p>
          <p className="text-sm font-semibold">{etaMs ? `${Math.round(etaMs / 1000)}s` : "--"}</p>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-900/70 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
