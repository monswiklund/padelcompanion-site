/**
 * PWA Install Prompt Logic
 * Handles the 'beforeinstallprompt' event and the install button UI
 */
export function initPWA(installBtnId) {
  let deferredPrompt;
  const installBtn = document.getElementById(installBtnId);

  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    if (installBtn) {
      installBtn.style.display = "inline-flex";

      installBtn.addEventListener("click", async () => {
        // Hide the app provided install promotion
        installBtn.style.display = "none";
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt = null;
      });
    }
  });

  window.addEventListener("appinstalled", () => {
    // Hide the app-provided install promotion
    if (installBtn) installBtn.style.display = "none";
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    console.log("PWA was installed");
  });

  // Register service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/registerSW.js");
    });
  }
}
