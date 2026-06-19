/**
 * create-resources page script (Astro deferred module — runs after DOM parse).
 *
 * PHASE 2a (this file so far): the loading flow + mini-lesson shuffle bag + the
 * initial render. On load we show the loading state (skeleton + sparkle + cycling
 * message), then after LOADING_MS add `.loaded`, draw a random mini lesson from a
 * unique-cycle bag, and render it.
 *
 * TODO (2b/2c/2d): recreate (ays) + back (byg) modal wiring, on-demand generation
 * of student materials / sample script (random 1-of-N + A1↔A2 toggle on recreate),
 * sidenav generated/current sync, print, ?student= → title, .no-worksheet.
 */
import { MINI_LESSONS, type LessonSet } from "../data/lessonSets";
import { wireModal } from "./modal";

/** Loading duration. 3000 for testing; production is 9000. */
const LOADING_MS = 3000;

const html = document.documentElement;

// ---- State (in-memory only; a reload wipes it, per spec) ----
const state = {
  currentSet: null as LessonSet | null,
  generated: { worksheet: false, sampleScript: false } as Record<string, boolean>,
  currentView: "miniLesson" as "miniLesson" | "worksheet" | "sampleScript",
  generatedAt: { miniLesson: null, worksheet: null, sampleScript: null } as
    Record<string, string | null>,
  // Which 1-of-N variant is currently shown per material (null = not yet generated).
  materialIndex: { worksheet: null, sampleScript: null } as Record<string, number | null>,
};

const SECTION_IDS: Record<string, string> = {
  miniLesson: "section-miniLesson",
  worksheet: "section-worksheet",
  sampleScript: "section-sampleScript",
};
const PREVIEW_IDS: Record<string, string> = {
  worksheet: "lessonPreviewWorksheet",
  sampleScript: "lessonPreviewSampleScript",
};
// ---- Mini-lesson shuffle bag: unique random cycle, no repeats until exhausted ----
let bag: LessonSet[] = [];
let lastShown: LessonSet | null = null;
function refillBag() {
  bag = [...MINI_LESSONS];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  // Avoid an immediate repeat across a reshuffle.
  if (lastShown && bag.length > 1 && bag[0] === lastShown) {
    [bag[0], bag[1]] = [bag[1], bag[0]];
  }
}
function nextMiniLesson(): LessonSet {
  if (bag.length === 0) refillBag();
  const set = bag.shift()!;
  lastShown = set;
  return set;
}

// ---- Timestamp ("Generated May 15, 2026 - 3:52pm") ----
function formatNow(): string {
  const d = new Date();
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  let hours = d.getHours();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `Generated ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} - ${hours}:${minutes}${ampm}`;
}
function setTimestamp(text: string | null) {
  const el = document.getElementById("generatedTimestamp");
  if (el) el.textContent = text || "";
}

// ---- CTA footer reveal (1.5s after a render) ----
let ctasDelayTimer: number | undefined;
function scheduleCtas() {
  clearTimeout(ctasDelayTimer);
  ctasDelayTimer = window.setTimeout(() => {
    html.classList.add("ctas-visible");
    adjustPageAreaHeight();
  }, 1500);
}

// ---- Size the page-area to fill the viewport (capped at 920px) ----
function adjustPageAreaHeight() {
  const pageArea = document.querySelector<HTMLElement>(".page-area");
  if (!pageArea) return;
  if (!html.classList.contains("loaded") || html.classList.contains("recreating")) return;
  const rect = pageArea.getBoundingClientRect();
  const viewportAvailable = window.innerHeight - rect.top - 16;
  pageArea.style.height = Math.min(viewportAvailable, 920) + "px";
}
window.addEventListener("resize", adjustPageAreaHeight);

// ---- Sidenav slider: slide the purple highlight to the active item ----
function updateNavSlider() {
  const slider = document.getElementById("navSlider");
  const sidenav = document.querySelector(".sidenav");
  if (!slider || !sidenav) return;
  const mlEl = document.getElementById("navMiniLesson");
  const activeEl = mlEl?.classList.contains("ml-active")
    ? mlEl
    : sidenav.querySelector<HTMLElement>(".subnav-item.current, .subnav-item.nav-pending");
  if (!activeEl) { slider.style.opacity = "0"; return; }
  slider.style.left = "7px";
  slider.style.opacity = "1";
  slider.style.top = (activeEl as HTMLElement).offsetTop + "px";
  slider.style.height = (activeEl as HTMLElement).offsetHeight + "px";
}

// ---- Apply state → sidenav classes + CTA visibility ----
function syncSidenavAndCtas() {
  document.getElementById("navMiniLesson")
    ?.classList.toggle("ml-active", state.currentView === "miniLesson");
  document.querySelectorAll<HTMLElement>(".subnav-item[data-material]").forEach((el) => {
    const mat = el.dataset.material as "worksheet" | "sampleScript";
    el.classList.toggle("generated", !!state.generated[mat]);
    el.classList.toggle("current", state.currentView === mat);
    // Sparkle ↔ refresh swap is driven by .is-swapped on the Button.
    el.querySelector(".sparkle-btn")?.classList.toggle("is-swapped", !!state.generated[mat]);
  });
  document.querySelectorAll<HTMLElement>(".pdf-cta[data-material]").forEach((cta) => {
    const mat = cta.dataset.material as "worksheet" | "sampleScript";
    cta.classList.toggle("is-generated", !!state.generated[mat]);
  });
  updateNavSlider();
}

function hideCtasNow() {
  clearTimeout(ctasDelayTimer);
  html.classList.remove("ctas-visible");
}

// ---- Render the mini-lesson preview (schedules the CTA reveal once loaded) ----
function renderMiniLesson(webpUrl: string) {
  const img = document.getElementById("lessonPreviewMiniLesson") as HTMLImageElement | null;
  if (!img) return;
  img.onload = () => {
    adjustPageAreaHeight();
    if (!html.classList.contains("ctas-visible")) scheduleCtas();
  };
  if (webpUrl) img.src = import.meta.env.BASE_URL + webpUrl;
}

function scrollToSection(sectionId: string) {
  const pa = document.querySelector<HTMLElement>(".page-area");
  const section = document.getElementById(sectionId);
  if (pa && section) pa.scrollTo({ top: section.offsetTop, behavior: "smooth" });
}

// Pick the webp for a material from the CURRENT set: random 1-of-N on first
// generation; toggle to the next (A1↔A2) on recreate.
function pickMaterialWebp(material: "worksheet" | "sampleScript"): string | null {
  const arr = material === "worksheet"
    ? state.currentSet?.studentMaterials
    : state.currentSet?.sampleScripts;
  if (!arr || arr.length === 0) return null;
  const cur = state.materialIndex[material];
  const idx = cur == null ? Math.floor(Math.random() * arr.length) : (cur + 1) % arr.length;
  state.materialIndex[material] = idx;
  return arr[idx];
}

// Reveal a freshly generated section (fade its preview in).
function revealSection(material: "worksheet" | "sampleScript", webp: string | null) {
  const section = document.getElementById(SECTION_IDS[material]);
  const img = document.getElementById(PREVIEW_IDS[material]) as HTMLImageElement | null;
  if (!section || !img) return;
  section.classList.add("visible");
  img.onload = () => {
    adjustPageAreaHeight();
    if (!html.classList.contains("ctas-visible")) scheduleCtas();
  };
  if (webp) img.src = import.meta.env.BASE_URL + webp;
}

// Re-render an already-visible section's preview (recreate toggle).
function reRenderSection(material: "worksheet" | "sampleScript", webp: string | null) {
  const img = document.getElementById(PREVIEW_IDS[material]) as HTMLImageElement | null;
  if (!img) return;
  img.onload = () => {
    adjustPageAreaHeight();
  };
  if (webp) img.src = import.meta.env.BASE_URL + webp;
}

// ---- Loading messages (cycle every 3s; clip-fade via .fade-in) ----
const LOADING_MESSAGES = [
  "Zearn AI is creating materials for your student right now.",
  "Remember that AI can make mistakes.",
  "Please check your materials carefully for relevance and accuracy.",
];
let shuffledMessages = [...LOADING_MESSAGES];
let msgIndex = 0;
let cycleInterval: number | undefined;
function shuffleMessages() {
  shuffledMessages = [...LOADING_MESSAGES];
  for (let i = shuffledMessages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledMessages[i], shuffledMessages[j]] = [shuffledMessages[j], shuffledMessages[i]];
  }
}
function showLoadingMessage() {
  const text = shuffledMessages[msgIndex];
  msgIndex = (msgIndex + 1) % shuffledMessages.length;
  document.querySelectorAll<HTMLElement>(".loading-message").forEach((el) => {
    el.classList.remove("fade-in");
    setTimeout(() => {
      el.textContent = text;
      el.classList.add("fade-in");
    }, 500);
  });
}
function startLoadingCycle() {
  shuffleMessages();
  const firstText = shuffledMessages[0];
  msgIndex = 1;
  document.querySelectorAll<HTMLElement>(".loading-message").forEach((el) => {
    el.textContent = firstText;
    el.classList.add("fade-in");
  });
  clearInterval(cycleInterval);
  cycleInterval = window.setInterval(showLoadingMessage, 3000);
}
function stopLoadingCycle() {
  clearInterval(cycleInterval);
  cycleInterval = undefined;
}

// ---- Init: loading → loaded → render a random mini lesson ----
startLoadingCycle();
window.setTimeout(() => {
  stopLoadingCycle();
  html.classList.add("loaded");
  state.currentSet = nextMiniLesson();
  renderMiniLesson(state.currentSet.miniLesson);
  state.generatedAt.miniLesson = formatNow();
  setTimestamp(state.generatedAt.miniLesson);
  syncSidenavAndCtas();
}, LOADING_MS);

// ---- Generate / recreate flow ----
//   null         → recreate the Mini Lesson (next set from the bag; reset materials)
//   "worksheet"  → generate / recreate Student Materials (random 1-of-N, then toggle)
//   "sampleScript" → generate / recreate the Sample Script
function triggerLoadingThenRender(material: "worksheet" | "sampleScript" | null) {
  hideCtasNow();
  setTimestamp("");
  const isMiniLessonRecreate = material === null;

  if (isMiniLessonRecreate) {
    document.querySelector(".page-area")?.scrollTo({ top: 0 });
    html.classList.add("recreating");
  } else {
    // Move the inline loader into the target section; the section's CTA + preview
    // are hidden by the loading-worksheet / loading-samplescript rules. Mini lesson
    // + button-group stay put.
    html.classList.add(material === "worksheet" ? "loading-worksheet" : "loading-samplescript");
    const section = document.getElementById(SECTION_IDS[material]);
    const loader = document.getElementById("newMaterialLoading");
    if (section && loader) section.appendChild(loader);
    requestAnimationFrame(() => scrollToSection(SECTION_IDS[material]));
  }

  startLoadingCycle();
  window.setTimeout(() => {
    stopLoadingCycle();
    html.classList.remove("recreating", "loading-worksheet", "loading-samplescript");
    // Return the loader to the page-area so it can be reused next time.
    const loader = document.getElementById("newMaterialLoading");
    const pa = document.querySelector(".page-area");
    if (loader && pa && loader.parentElement !== pa) pa.appendChild(loader);

    if (material === "worksheet" || material === "sampleScript") {
      const wasGenerated = state.generated[material];
      const webp = pickMaterialWebp(material);
      state.generated[material] = true;
      state.currentView = material;
      state.generatedAt[material] = formatNow();
      syncSidenavAndCtas();
      if (wasGenerated) reRenderSection(material, webp);
      else revealSection(material, webp);
      setTimestamp(state.generatedAt[material]);
    } else {
      // Mini lesson recreate: dependent materials were aligned to the old lesson —
      // reset them, then draw the next set from the bag.
      state.generated.worksheet = false;
      state.generated.sampleScript = false;
      state.generatedAt.worksheet = null;
      state.generatedAt.sampleScript = null;
      state.materialIndex.worksheet = null;
      state.materialIndex.sampleScript = null;
      for (const id of ["section-worksheet", "section-sampleScript"]) {
        document.getElementById(id)?.classList.remove("visible");
      }
      for (const id of ["lessonPreviewWorksheet", "lessonPreviewSampleScript"]) {
        const img = document.getElementById(id) as HTMLImageElement | null;
        if (img) { img.removeAttribute("src"); img.classList.remove("img-loaded"); }
      }
      const next = nextMiniLesson();
      state.currentSet = next;
      state.currentView = "miniLesson";
      syncSidenavAndCtas();
      renderMiniLesson(next.miniLesson);
      state.generatedAt.miniLesson = formatNow();
      setTimestamp(state.generatedAt.miniLesson);
    }
  }, LOADING_MS);
}

// ---- Modals + interactions ----
const byg = wireModal("#bygModal");
const ays = wireModal("#aysModal");
let skipAysModal = false; // in-memory only (resets on reload)
// What AYS will recreate on confirm: null = Mini Lesson, else that material.
let pendingMaterial: "worksheet" | "sampleScript" | null = null;

// Back to Tower Alerts → byg (its primary <a> then navigates to /tower-alerts).
document.querySelector<HTMLAnchorElement>("a.back-btn")?.addEventListener("click", (e) => {
  e.preventDefault();
  byg?.open();
});
// Top RECREATE → always the Mini Lesson (ays unless "don't show again" was set).
document.getElementById("recreateBtn")?.addEventListener("click", () => {
  pendingMaterial = null;
  if (skipAysModal) triggerLoadingThenRender(null);
  else ays?.open();
});
document.getElementById("aysCancel")?.addEventListener("click", () => ays?.close());
document.getElementById("aysRecreate")?.addEventListener("click", () => {
  const dontShow = document.getElementById("aysDontShow") as HTMLInputElement | null;
  if (dontShow?.checked) skipAysModal = true;
  ays?.close();
  triggerLoadingThenRender(pendingMaterial);
});

// End-of-page CTA buttons → first-time generation.
document.getElementById("ctaStudentMaterials")?.addEventListener("click", () => triggerLoadingThenRender("worksheet"));
document.getElementById("ctaSampleScript")?.addEventListener("click", () => triggerLoadingThenRender("sampleScript"));

// Sidenav sparkle buttons: generate (first time, no modal) or recreate (ays unless skipped).
function wireSparkle(subnavId: string, material: "worksheet" | "sampleScript") {
  document.querySelector(`#${subnavId} .sparkle-btn`)?.addEventListener("click", (e) => {
    e.stopPropagation(); // don't also fire the row's nav click
    if (state.generated[material]) {
      pendingMaterial = material;
      if (skipAysModal) triggerLoadingThenRender(material);
      else ays?.open();
    } else {
      triggerLoadingThenRender(material);
    }
  });
}
wireSparkle("navStudentMaterials", "worksheet");
wireSparkle("navSampleScript", "sampleScript");

// Sidenav row navigation: scroll to the section; set current view for Mini Lesson
// or an already-generated material. (Scroll-position tracking of currentView is a
// later polish pass.)
function navScrollTo(material: "miniLesson" | "worksheet" | "sampleScript") {
  if (material === "miniLesson" || state.generated[material]) {
    state.currentView = material;
    syncSidenavAndCtas();
    setTimestamp(state.generatedAt[material]);
  }
  scrollToSection(SECTION_IDS[material]);
}
document.getElementById("navMiniLesson")?.addEventListener("click", () => navScrollTo("miniLesson"));
document.getElementById("navStudentMaterials")?.addEventListener("click", () => navScrollTo("worksheet"));
document.getElementById("navSampleScript")?.addEventListener("click", () => navScrollTo("sampleScript"));

// ---- Print: the on-screen webp previews (one per page) via a hidden iframe ----
// Outputs exactly what's generated, in DOM order; prints only the materials, not
// the surrounding UI. (Note: print() opens the native dialog — don't fire it in
// automated checks.)
let printFrame: HTMLIFrameElement | null = null;
function printCurrentMaterials() {
  const imgs = [...document.querySelectorAll<HTMLImageElement>("img.lesson-preview")]
    .filter((img) => img.getAttribute("src") && img.offsetParent !== null);
  if (!imgs.length) return;
  const body = imgs.map((img) => `<img src="${img.src}" />`).join("");
  const doc =
    `<!doctype html><html><head><meta charset="utf-8" />` +
    `<style>@page{margin:0}html,body{margin:0;padding:0}` +
    `img{display:block;width:100%;page-break-after:always}` +
    `img:last-child{page-break-after:auto}</style></head>` +
    `<body>${body}</body></html>`;
  if (!printFrame) {
    printFrame = document.createElement("iframe");
    Object.assign(printFrame.style, {
      position: "fixed", left: "-9999px", top: "-9999px",
      width: "0", height: "0", border: "0", visibility: "hidden",
    });
    document.body.appendChild(printFrame);
  }
  printFrame.onload = () => {
    setTimeout(() => {
      try {
        printFrame!.contentWindow?.focus();
        printFrame!.contentWindow?.print();
      } catch {
        /* no-op */
      }
    }, 200);
  };
  printFrame.srcdoc = doc;
}
// Both Print buttons (button-group + Before-You-Go modal) carry aria-label="Print".
document
  .querySelectorAll<HTMLButtonElement>('button[aria-label="Print"]')
  .forEach((b) => b.addEventListener("click", printCurrentMaterials));

// ---- URL params: student → subnav title; lesson → doc title (context only) ----
// The mini lesson itself is random (shuffle bag), not matched to the lesson param.
const params = new URLSearchParams(location.search);
const student = params.get("student");
const lesson = params.get("lesson");
if (student) {
  const title = document.querySelector(".center-title");
  if (title) title.textContent = `Targeted Materials for ${student}`;
  document.title = `Create Resources – ${student}${lesson ? ` – ${lesson}` : ""} – Zearn`;
}
// (.no-worksheet from the prototype is intentionally not wired: in the shuffle-bag
//  model every set has student materials, so it's unreachable.)
