/**
 * The pool of mini-lesson "sets" the page cycles through (shuffle bag).
 * Each set = a mini lesson + its aligned student-materials (1 of N) + aligned
 * sample-scripts (1 of N). The "AI" picks a set at random on create/recreate
 * (unique cycle), and within a set picks one student-material / sample-script.
 *
 * END STATE: 5 sets, each with 2 student-materials + 2 sample-scripts.
 * CURRENT: 4 sets, 1 of each (the random-of-N + A1↔A2 toggle logic degrades
 * gracefully to the single variant until the 5th set + second variants land —
 * a pure data change here, no code change).
 */
export interface LessonSet {
  id: string;
  miniLesson: string;
  studentMaterials: string[];
  sampleScripts: string[];
}

export const MINI_LESSONS: LessonSet[] = [
  {
    id: "G3M3L7",
    miniLesson: "/previews/mini_lesson_G3M3L7.webp",
    studentMaterials: ["/previews/student_materials_G3M3L7@2x.webp"],
    sampleScripts: ["/previews/sample_script_G3M3L7.webp"],
  },
  {
    id: "G4M5L6",
    miniLesson: "/previews/mini_lesson_G4M5L6.webp",
    studentMaterials: ["/previews/student_materials_G4M5L6@2x.webp"],
    sampleScripts: ["/previews/sample_script_G4M5L6.webp"],
  },
  {
    id: "G5M6L19",
    miniLesson: "/previews/mini_lesson_G5M6L19.webp",
    studentMaterials: ["/previews/student_materials_G5M6L19@2x.webp"],
    sampleScripts: ["/previews/sample_script_G5M6L19.webp"],
  },
  {
    id: "G8M2L10",
    miniLesson: "/previews/mini_lesson_G8M2L10.webp",
    studentMaterials: ["/previews/student_materials_G8M2L10@2x.webp"],
    sampleScripts: ["/previews/sample_script_G8M2L10.webp"],
  },
];
