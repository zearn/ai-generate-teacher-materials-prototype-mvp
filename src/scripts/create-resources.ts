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

/** Loading duration. 3000 for testing; production is 9000. */
const LOADING_MS = 3000;

const html = document.documentElement;

// ---- State (in-memory only; a reload wipes it, per spec) ----
const state = {
  currentSet: null as LessonSet | null,
  generated: { worksheet: false, sampleScript: false },
  currentView: "miniLesson" as "miniLesson" | "worksheet" | "sampleScript",
  generatedAt: { miniLesson: null, worksheet: null, sampleScript: null } as
    Record<string, string | null>,
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

// ---- Render the mini-lesson preview (schedules the CTA reveal once loaded) ----
function renderMiniLesson(webpUrl: string) {
  const img = document.getElementById("lessonPreviewMiniLesson") as HTMLImageElement | null;
  if (!img) return;
  img.onload = () => {
    adjustPageAreaHeight();
    if (!html.classList.contains("ctas-visible")) scheduleCtas();
  };
  if (webpUrl) img.src = webpUrl;
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
  updateNavSlider();
}, LOADING_MS);
