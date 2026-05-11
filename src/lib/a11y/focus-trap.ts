/**
 * Svelte action: trap Tab navigation inside the bound element.
 *
 * Usage:
 *   <div use:focusTrap>
 *     ...focusable elements...
 *   </div>
 *
 * On mount: moves focus to the first focusable child (or the bound element if
 * none) and intercepts Tab/Shift+Tab to wrap within the container. Restores
 * focus to the previously-focused element on teardown.
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

function focusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('aria-hidden') && el.offsetParent !== null
  );
}

export function focusTrap(node: HTMLElement) {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  function handleKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const items = focusable(node);
    if (items.length === 0) {
      e.preventDefault();
      node.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (active === first || !node.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last || !node.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  }

  // Defer initial focus to next microtask so child mount completes.
  queueMicrotask(() => {
    const items = focusable(node);
    if (items.length > 0) {
      items[0].focus();
    } else {
      node.setAttribute('tabindex', '-1');
      node.focus();
    }
  });

  node.addEventListener('keydown', handleKey);

  return {
    destroy() {
      node.removeEventListener('keydown', handleKey);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        try {
          previouslyFocused.focus();
        } catch {
          // ignore — element may have been unmounted
        }
      }
    }
  };
}
