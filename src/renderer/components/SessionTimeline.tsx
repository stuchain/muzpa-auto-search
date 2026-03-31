import { useMemo } from "react";
import { useRunnerStore } from "../state/useRunnerStore";

export function SessionTimeline() {
  const { session } = useRunnerStore();
  const recent = useMemo(() => {
    if (!session) return [];
    return [...session.rows].reverse().filter((r) => r.status !== "pending").slice(0, 8);
  }, [session]);

  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="mb-3 text-lg font-semibold">Recent Actions</h2>
      <div className="space-y-2 text-sm">
        {recent.length === 0 ? <p className="text-slate-400">No actions yet.</p> : null}
        {recent.map((row) => (
          <div key={row.index} className="rounded-xl bg-slate-900/60 p-3">
            <p className="font-medium">{row.track}</p>
            <p className="text-xs text-slate-400">{row.artist}</p>
            <p className="mt-1 text-xs capitalize text-accent">{row.status.replace("_", " ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
