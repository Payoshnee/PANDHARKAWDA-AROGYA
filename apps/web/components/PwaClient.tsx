"use client";

import { useEffect, useState } from "react";

export function PwaClient() {
  const [offline, setOffline] = useState(() => {
    if (typeof navigator === "undefined") return false;
    return !navigator.onLine;
  });

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline emergency still works when already cached; registration failures are non-fatal.
      });
    }

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return offline ? (
    <div className="offline-banner" role="status">
      Offline mode. Emergency numbers may be cached; call 108 for ambulance emergencies.
    </div>
  ) : null;
}
