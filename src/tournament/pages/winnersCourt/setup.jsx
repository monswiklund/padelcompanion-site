import React from "react";
import { createRoot } from "react-dom/client";
import { WinnersCourtSetup } from "./WinnersCourtSetup";

let root = null;

/**
 * Render setup form.
 */
export function renderSetup(container, pageState, addListener, onReRender) {
  // pageState in React version is mostly internal to the component,
  // except for 'onGameActive' which corresponds to 'onReRender' (or logic that triggers re-render).
  // The legacy 'pageState' object passed from index.js (with tempPlayers etc.)
  // is now effectively ignored in favor of StorageService within the component,
  // OR we should pass it as initial data?
  // The component loads from StorageService on mount.
  // The legacy index.js also loads from StorageService and passes it in.
  // So it should be in sync if they use the same keys.
  // Keys used: 'wc_setup_players', 'wc_split_sides'.
  // WinnersCourtSetup.tsx uses these keys.

  container.innerHTML = "";

  // Create a fresh root for each render to avoid conflicts in hybrid navigation
  const reactRoot = createRoot(container);

  reactRoot.render(
    <WinnersCourtSetup
      onGameActive={() => {
        // When game is generated, we need to trigger re-render of the page
        // effectively switching to "Active View"
        onReRender();
      }}
    />
  );

  return () => reactRoot.unmount();
}
