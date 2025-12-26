/**
 * Tournament Router
 * Hash-based client-side router with page lifecycle management.
 * Prevents listener leaks via mount/unmount pattern.
 */

let currentPage = null;
const routes = {};

/**
 * Register a route with a page module.
 * @param {string} path - Route path (e.g., 'bracket', 'generator')
 * @param {Object} page - Page module with mount/unmount methods
 */
export function registerRoute(path, page) {
  routes[path] = page;
}

/**
 * Initialize the router.
 * Call this after all routes are registered.
 */
export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute(); // Handle initial route
}

/**
 * Navigate to a route programmatically.
 * @param {string} path - Route path
 */
export function navigate(path) {
  location.hash = `#/${path}`;
}

/**
 * Get current route info.
 * @returns {{ route: string, params: URLSearchParams }}
 */
export function getCurrentRoute() {
  const { route, params } = parseHash();
  return { route, params };
}

/**
 * Parse hash into route and query params.
 * Handles: #/bracket, #/bracket/, #/bracket?id=123
 */
function parseHash() {
  const raw = location.hash.slice(2) || ""; // Remove '#/'
  const [routePart, queryPart] = raw.split("?");
  const route = routePart.replace(/\/$/, ""); // Normalize trailing slash
  const params = new URLSearchParams(queryPart || "");
  return { route, params };
}

/**
 * Handle route changes.
 */
function handleRoute() {
  const { route, params } = parseHash();
  const page = routes[route] || routes[""] || routes["generator"];

  if (!page) {
    console.warn(`[Router] No page found for route: ${route}`);
    return;
  }

  // Unmount previous page to prevent listener leaks
  if (currentPage?.unmount) {
    try {
      currentPage.unmount();
    } catch (e) {
      console.error("[Router] Error unmounting page:", e);
    }
  }

  // Show loading skeleton
  const container = document.getElementById("pageContainer");
  if (container) {
    container.innerHTML = `
      <div style="padding: 20px;">
        <div class="loading-skeleton skeleton-header" style="width: 50%; height: 40px; margin-bottom: 30px;"></div>
        <div class="loading-skeleton skeleton-card" style="height: 200px; margin-bottom: 20px;"></div>
        <div class="loading-skeleton skeleton-card" style="height: 150px;"></div>
      </div>
    `;
  }

  // Small delay to allow Paint (and optional visual feel of transition)
  setTimeout(() => {
    currentPage = page;

    // Mount new page
    if (container && currentPage.mount) {
      try {
        currentPage.mount(container, params);
      } catch (e) {
        console.error("[Router] Error mounting page:", e);
        container.innerHTML = `
          <div class="alert alert-danger" style="margin: 20px;">
            <h3>Error Loading Page</h3>
            <pre>${e.message}\n${e.stack}</pre>
            <button class="btn btn-secondary" onclick="window.location.reload()">Reload</button>
          </div>
        `;
      }
    }
  }, 50);
}
