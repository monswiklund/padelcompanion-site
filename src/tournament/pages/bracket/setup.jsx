import React from "react";
import { createRoot } from "react-dom/client";
import { BracketSetup } from "./BracketSetup";

let root = null;

/**
 * Render the setup form (React)
 */
export function renderSetup(container, onComplete) {
  // If we already have a root for this container, unmount it?
  // Ideally we should reuse it but since the container might be wiped by parent navigation,
  // we check if the container is fresh.

  // For safety in this hybrid app, let's treat every renderSetup as a fresh mount.
  // But we need to be careful not to leak roots if renderSetup is called repeatedly.

  // Clean up previous content (if any was manually set, though unlikely now)
  container.innerHTML = "";

  if (!root) {
    root = createRoot(container);
  }

  // Because 'container' might change if the user navigates away and back,
  // 'root' variable might hold a reference to a detached DOM node/root.
  // A safer pattern for hybrid apps:

  const reactRoot = createRoot(container);
  reactRoot.render(<BracketSetup onComplete={onComplete} />);

  // Return a cleanup function if the caller supports it (navigation)
  return () => {
    reactRoot.unmount();
  };
}

export function cleanupSetupListeners() {
  // No-op for React
}
