/**
 * Lessons keyed by KEY (grade/mission/lesson, e.g. "G1M3L4", "KM2L2").
 *
 * Each lesson has two mini-lesson variants, A and B. Student materials and sample
 * scripts are aligned to the mini-lesson variant by LETTER (A* go with mini lesson
 * A, B* with mini lesson B) and numbered within that letter (1, 2, 3…). Only "1"
 * exists today, so the arrays are length 1 — add A2/A3 here later with no code
 * change (the state machine always shows index 0 for now).
 *
 * The KEY is chosen by the clicked Tower Alerts card (?key=…); create-resources
 * picks a random initial mini-lesson variant and cycles A↔B on each recreate.
 */
export interface Lesson {
  miniLesson: { A: string; B: string };
  studentMaterials: { A: string[]; B: string[] };
  sampleScripts: { A: string[]; B: string[] };
}

export const LESSON_KEYS = [
  "KM2L2", "G1M3L4", "G2M5L6", "G3M4L9", "G4M5L16",
  "G5M6L19", "G6M8L6", "G7M5L9", "G8M2L10",
] as const;

// Filenames are fully determined by the KEY + variant (see public/previews/), so
// build the table instead of hand-listing 54 paths. mini lesson = "_A"/"_B";
// student materials / sample scripts = "_A1"/"_B1" (student materials add @2x).
const p = (name: string) => `/previews/${name}`;
function lesson(key: string): Lesson {
  return {
    miniLesson: {
      A: p(`mini_lesson_${key}_A.webp`),
      B: p(`mini_lesson_${key}_B.webp`),
    },
    studentMaterials: {
      A: [p(`student_materials_${key}_A1@2x.webp`)],
      B: [p(`student_materials_${key}_B1@2x.webp`)],
    },
    sampleScripts: {
      A: [p(`sample_script_${key}_A1.webp`)],
      B: [p(`sample_script_${key}_B1.webp`)],
    },
  };
}

export const LESSONS: Record<string, Lesson> =
  Object.fromEntries(LESSON_KEYS.map((k) => [k, lesson(k)]));
