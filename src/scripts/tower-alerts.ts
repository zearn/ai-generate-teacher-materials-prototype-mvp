/**
 * Tower Alerts page interactions — ported 1:1 from the prototype's inline script.
 *
 * Covers: collapsible Students/Content panels, the Completed Towers toggle, the
 * help-icon tooltip, the breadcrumb scroll-shadow, and the Create Targeted
 * Materials modal (intercept the alert-card links, populate the modal from the
 * link's data-* attributes, and navigate on CREATE).
 *
 * Astro <script> tags are deferred modules (run after DOM parse), so no
 * DOMContentLoaded wrapper is needed.
 */
import { wireModal } from "./modal";

// ---- Panel collapse ----
document.querySelectorAll<HTMLElement>("[data-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.toggle!)?.classList.toggle("collapsed");
  });
});

// ---- Completed Towers toggle ----
const tog = document.getElementById("completedToggle");
tog?.querySelector(".switch")?.addEventListener("click", () => {
  tog.classList.toggle("on");
  tog.classList.toggle("off");
  tog.setAttribute("aria-checked", String(tog.classList.contains("on")));
});

// ---- Help tooltip ----
const tip = document.getElementById("tooltip");
const helpIcon = document.getElementById("helpIcon");
if (tip && helpIcon) {
  const showTip = () => {
    tip.textContent = helpIcon.dataset.tip ?? "";
    tip.classList.add("show");
    const r = helpIcon.getBoundingClientRect();
    tip.style.left = `${r.left + window.scrollX}px`;
    tip.style.top = `${r.top + window.scrollY}px`;
  };
  const hideTip = () => tip.classList.remove("show");
  helpIcon.addEventListener("mouseenter", showTip);
  helpIcon.addEventListener("mouseleave", hideTip);
  helpIcon.addEventListener("focus", showTip);
  helpIcon.addEventListener("blur", hideTip);
}

// ---- Scroll shadow on breadcrumb ----
const headerWrap = document.querySelector(".header-wrap");
if (headerWrap) {
  const onScroll = () => headerWrap.classList.toggle("scrolled", window.scrollY > 0);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ---- Modal: Create Targeted Materials ----
const ctm = wireModal("#ctmModal");
if (ctm) {
  const ctmStudent = document.getElementById("ctmStudent");
  const ctmMissionLesson = document.getElementById("ctmMissionLesson");
  const ctmObjective = document.getElementById("ctmObjective");
  const modalCreate = document.getElementById("ctmCreateBtn");

  // loc:    "Grade 4 | Mission 3 | Topic B"  → "Mission 3"
  // lesson: "Lesson 4: Leftward Ho"          → "Lesson 4"
  function extractMissionLesson(loc?: string, lesson?: string): string {
    const m = (loc ?? "").match(/Mission\s+\d+/i);
    const l = (lesson ?? "").match(/Lesson\s+\d+/i);
    return [m?.[0], l?.[0]].filter(Boolean).join(", ");
  }

  let pendingHref = "";
  function openCtm(link: HTMLAnchorElement) {
    pendingHref = link.getAttribute("href") ?? "";
    if (ctmStudent) ctmStudent.textContent = link.dataset.student ?? "";
    if (ctmMissionLesson)
      ctmMissionLesson.textContent = extractMissionLesson(link.dataset.loc, link.dataset.lesson);
    if (ctmObjective) ctmObjective.textContent = link.dataset.desc ?? "";
    ctm!.open();
  }

  document.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a.create-resources");
    if (link) {
      e.preventDefault();
      openCtm(link);
    }
  });

  modalCreate?.addEventListener("click", () => {
    if (pendingHref) window.location.href = pendingHref;
  });
}
