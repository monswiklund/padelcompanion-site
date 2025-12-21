export function initPWA(installBtnId, onIOSInstall) {
  let deferredPrompt;
  const installBtn = document.getElementById(installBtnId);

  // iOS Detection
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone;

  // Android/Chrome Logic
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

  // iOS Logic
  if (isIOS && !isStandalone && installBtn && onIOSInstall) {
    installBtn.style.display = "inline-flex";
    installBtn.addEventListener("click", () => {
      onIOSInstall();
    });
  }

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
