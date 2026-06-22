/**
 * wireModal — verbatim port of the prototype's shared modal helper.
 *
 * Wires open/close + Escape + overlay-click + scroll-lock on a modal whose
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

  // Close on Escape — only bound while the modal is open (added in open(), torn
  // down in close()), so nothing lingers on document for the page's lifetime.
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  // Lock background scroll while the modal is open. overflow:hidden removes the
  // page scrollbar, which would shift the page ~15px sideways; compensate by
  // padding the body with the scrollbar's width so nothing behind the modal moves.
  const open = () => {
    modal.hidden = false;
    modal.classList.add("open");
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.addEventListener("keydown", onKeydown);
  };
  const close = () => {
    modal.classList.remove("open");
    modal.hidden = true;
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    document.removeEventListener("keydown", onKeydown);
  };

  modal
    .querySelector<HTMLElement>(".modal-close")
    ?.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  return { open, close };
}
