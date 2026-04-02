import { useEffect, useState } from "react";
import { useRunnerStore } from "../state/useRunnerStore";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { run, next, pause, resume, exportHistory, loading } = useRunnerStore();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;
  const actions = [
    { label: "Run", fn: () => run() },
    { label: "Next (Done)", fn: () => next("done") },
    { label: "Pause", fn: () => pause() },
    { label: "Resume", fn: () => resume() },
    { label: "Export logs", fn: () => exportHistory() }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24" onClick={() => setOpen(false)}>
      <div className="glass w-full max-w-xl rounded-2xl p-4" onClick={(event) => event.stopPropagation()}>
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">Command Palette</p>
        <div className="space-y-2">
          {actions.map((action) => (
            <button
              key={action.label}
              className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-left hover:bg-slate-800"
              disabled={loading}
              onClick={() => {
                if (loading) return;
                void action.fn();
                setOpen(false);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
