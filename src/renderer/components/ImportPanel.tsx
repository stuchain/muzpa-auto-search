import { FileUp } from "lucide-react";
import { useRunnerStore } from "../state/useRunnerStore";

export function ImportPanel() {
  const { csvPath, warnings, pickCsv } = useRunnerStore();

  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">CSV Import</h2>
        <button
          type="button"
          onClick={() => void pickCsv()}
          className="inline-flex items-center gap-2 rounded-xl bg-accent/20 px-3 py-2 font-medium text-accent hover:bg-accent/30"
        >
          <FileUp size={16} />
          Select CSV
        </button>
      </div>
      <p className="text-sm text-slate-300">{csvPath || "No file selected."}</p>
      {warnings.length > 0 ? (
        <div className="mt-3 rounded-xl border border-amber-400/40 bg-amber-500/10 p-3 text-xs text-amber-200">
          {warnings.join(" | ")}
        </div>
      ) : null}
    </section>
  );
}
