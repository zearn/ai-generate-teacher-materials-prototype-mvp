/**
 * wireModal — verbatim port of the prototype's shared modal helper.
 *
 * Wires open/close + Escape + overlay-click + body scroll-lock on a modal whose
 * root is the `.modal-overlay` element (Modal.astro's root, matched by `selector`,
 * usually `#id`) and which contains a `.modal-close` button somewhere inside.
 * Returns { open, close } so triggers elsewhere on the page can drive it.
 *
 * Astro `<script>` tags are deferred modules (run after DOM parse), so callers
 * don't need the old DOMContentLoaded wrapper.
 */
export interface ModalHandle {
  open(): void;
  close(): void;
}

export function wireModal(selector: string): ModalHandle | null {
  const modal = document.querySelector<HTMLElement>(selector);
  if (!modal) return null;

  const open = () => {
    modal.hidden = false;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    modal.classList.remove("open");
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  modal
    .querySelector<HTMLElement>(".modal-close")
    ?.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  return { open, close };
}
