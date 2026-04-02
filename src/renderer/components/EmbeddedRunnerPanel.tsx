import { useEffect, useMemo, useState } from "react";
import { useRunnerStore } from "../state/useRunnerStore";
import type { TrackRow } from "../../shared/types";
import { buildMuzpaSearchUrl } from "../../shared/muzpaUrl";

export function EmbeddedRunnerPanel() {
  const { session } = useRunnerStore();
  const [lastLoadedUrl, setLastLoadedUrl] = useState<string>("about:blank");

  const currentRow = useMemo<TrackRow | null>(() => {
    if (!session) return null;
    return session.rows[session.currentIndex] ?? null;
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (session.browser !== "embedded") return;
    if (session.state === "ready") return; // don't open anything before Run
    if (!currentRow) return;

    const nextUrl = buildMuzpaSearchUrl(currentRow.query);
    setLastLoadedUrl(nextUrl);
  }, [session, currentRow]);

  // Only render the webview once we have an embedded session started.
  const shouldShow = Boolean(session && session.browser === "embedded" && session.state !== "ready");
  const src = shouldShow ? lastLoadedUrl : "about:blank";

  if (!session || session.browser !== "embedded") return null;

  return (
    <section className="glass rounded-2xl p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold">Embedded Runner</h2>
          <p className="mt-1 truncate text-xs text-slate-400">
            Downloads are manual. Use Next/Skip buttons to advance.
          </p>
        </div>
        <span className="rounded-lg bg-accent/20 px-2 py-1 text-xs text-accent">{session.state}</span>
      </div>

      <div className="h-[70vh] min-h-[520px] w-full">
        <webview
          src={src}
          partition="persist:muzpa-auto-search"
          style={{ width: "100%", height: "100%" }}
          allowpopups={true}
        />
      </div>
    </section>
  );
}

