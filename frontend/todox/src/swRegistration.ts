// why: isole l'enregistrement SW et gère les mises à jour
export function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // Écoute les updates
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // Nouvelle version prête
              console.info("[PWA] Nouvelle version disponible. Rechargez la page.");
            }
          });
        });
      })
      .catch((err) => {
        console.error("[PWA] SW registration failed", err);
      });
  });
}