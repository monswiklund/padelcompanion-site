/**
 * Bracket UI Components
 * Barrel export for bracket UI sub-modules.
 */

// Side configuration
export {
  SIDE_CONFIGS,
  getSideConfig,
  getSideConfigs,
  createSideConfig,
  getRoundName,
} from "./sideConfig.js";

// Preview renderers
export {
  renderMiniBracketPreview,
  renderMiniBracketPreviewReversed,
  renderSideContainer,
  renderGrandFinalPreview,
} from "./previewRenderers.js";

// Multi-bracket previews
export {
  renderDualBracketPreview,
  renderMultiBracketPreview,
} from "./multiBracketPreview.js";
