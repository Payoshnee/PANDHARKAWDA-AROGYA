"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaClient() {
  const [offline, setOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    const markEngaged = () => setEngaged(true);
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    window.addEventListener("click", markEngaged, { once: true });
    window.addEventListener("beforeinstallprompt", captureInstallPrompt);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline emergency still works when already cached; registration failures are non-fatal.
      });
    }
    update();

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      window.removeEventListener("click", markEngaged);
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
    };
  }, []);

  return (
    <>
      {offline ? (
        <div className="offline-banner" role="status">
          Offline mode. Emergency numbers may be cached; call 108 for ambulance emergencies.
        </div>
      ) : null}
      {installPrompt && engaged ? (
        <div className="install-prompt" role="status">
          <span>Install Pandharkawda Arogya for faster emergency access.</span>
          <button
            onClick={async () => {
              await installPrompt.prompt();
              await installPrompt.userChoice;
              setInstallPrompt(null);
            }}
          >
            Install
          </button>
          <button onClick={() => setInstallPrompt(null)}>Dismiss</button>
        </div>
      ) : null}
    </>
  );
}
