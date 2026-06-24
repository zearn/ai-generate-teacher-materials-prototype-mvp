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
  // Source PDFs (served from public/pdf/) — the print path uses these so output is
  // vector + properly paginated. Same A/B + "1" variant model as the webps.
  pdf: {
    miniLesson: { A: string; B: string };
    studentMaterials: { A: string[]; B: string[] };
    sampleScripts: { A: string[]; B: string[] };
  };
}

export const LESSON_KEYS = [
  "KM2L2", "G1M3L4", "G2M5L6", "G3M4L9", "G4M5L16",
  "G5M6L19", "G6M8L6", "G7M5L9", "G8M2L10",
] as const;

// Filenames are fully determined by the KEY + variant, so build the table instead
// of hand-listing paths. webp (public/previews/): mini "_A"/"_B", student/script
// "_A1"/"_B1" (student adds @2x). PDF (public/pdf/): `{KEY}_{material}_{variant}`.
const webp = (name: string) => `/previews/${name}`;
const pdf = (name: string) => `/pdf/${name}`;
function lesson(key: string): Lesson {
  return {
    miniLesson: {
      A: webp(`mini_lesson_${key}_A.webp`),
      B: webp(`mini_lesson_${key}_B.webp`),
    },
    studentMaterials: {
      A: [webp(`student_materials_${key}_A1@2x.webp`)],
      B: [webp(`student_materials_${key}_B1@2x.webp`)],
    },
    sampleScripts: {
      A: [webp(`sample_script_${key}_A1.webp`)],
      B: [webp(`sample_script_${key}_B1.webp`)],
    },
    pdf: {
      miniLesson: {
        A: pdf(`${key}_mini_lesson_A.pdf`),
        B: pdf(`${key}_mini_lesson_B.pdf`),
      },
      studentMaterials: {
        A: [pdf(`${key}_student_materials_A1.pdf`)],
        B: [pdf(`${key}_student_materials_B1.pdf`)],
      },
      sampleScripts: {
        A: [pdf(`${key}_sample_script_A1.pdf`)],
        B: [pdf(`${key}_sample_script_B1.pdf`)],
      },
    },
  };
}

export const LESSONS: Record<string, Lesson> =
  Object.fromEntries(LESSON_KEYS.map((k) => [k, lesson(k)]));
