import React from "react";
import { createRoot } from "react-dom/client";
import { GeneratorSetup } from "./GeneratorSetup";

let root = null;

export function renderSetup(container, onGenerateCallback) {
  if (!container) return;
  container.innerHTML = "";

  const reactRoot = createRoot(container);

  reactRoot.render(
    <GeneratorSetup
      onGameActive={() => {
        // This callback is called when schedule is generated successfully
        // The logic inside GeneratorSetup calls "generateSchedule" which updates global state
        // Then it calls this.
        if (onGenerateCallback) onGenerateCallback();
      }}
    />
  );

  return () => reactRoot.unmount();
}
