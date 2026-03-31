import { useRunnerStore } from "../state/useRunnerStore";

export function TrackPreviewTable() {
  const { session } = useRunnerStore();
  const rows = session?.rows ?? [];
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="mb-4 text-lg font-semibold">Queue</h2>
      <div className="max-h-[360px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="pb-2">#</th>
              <th className="pb-2">Track</th>
              <th className="pb-2">Artist</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 200).map((row) => (
              <tr key={row.index} className="border-t border-white/5">
                <td className="py-2">{row.index + 1}</td>
                <td className="py-2">{row.track}</td>
                <td className="py-2">{row.artist}</td>
                <td className="py-2 capitalize">{row.status.replace("_", " ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
