/* Run with: npm run test:quiz  — checks the recommendation logic is deterministic and sensible. */
import { recommend, type Answers } from "../src/lib/recommend.ts";
import { quizQuestions } from "../src/content/quiz.ts";

const pick = (letters: string): Answers =>
  letters.split("").map((l, i) => quizQuestions[i].options["abcd".indexOf(l)]?.id);

const cases: { name: string; answers: string; primary: string; secondary?: string | null; notice?: string }[] = [
  { name: "All A → A2", answers: "aaaaaaa", primary: "a2" },
  { name: "All B → B1", answers: "bbbbbbb", primary: "b1" },
  { name: "All C → Bridge Speak", answers: "ccccccc", primary: "speak" },
  { name: "All D → Career Launch", answers: "ddddddd", primary: "career" },
  { name: "Wants speaking but knows only simple words → A2 + placement", answers: "cccaccc", primary: "a2", secondary: "speak", notice: "belowEntry" },
  { name: "Wants independence, only simple words → A2 + placement", answers: "bbbabbb", primary: "a2", secondary: "b1", notice: "belowEntry" },
  { name: "Everyday goal but already B1-ish → A2 with above-level note", answers: "aaacaaa", primary: "a2", secondary: "b1", notice: "aboveLevel" },
  { name: "Career goal, English matters (basic) → Career", answers: "ddbdddd", primary: "career" },
  { name: "Speak goal, mixed others", answers: "cbcbcbc", primary: "speak" },
];

let failed = 0;
for (const t of cases) {
  const r1 = recommend(pick(t.answers));
  const r2 = recommend(pick(t.answers));
  const ok =
    r1.primary === t.primary &&
    (t.secondary === undefined || r1.secondary === t.secondary) &&
    (t.notice === undefined || r1.notice?.kind === t.notice) &&
    JSON.stringify(r1) === JSON.stringify(r2);
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${t.name}  →  ${r1.primary} / ${r1.secondary ?? "-"} ${r1.notice ? "[" + r1.notice.kind + "]" : ""}  scores=${JSON.stringify(r1.scores)}`);
}

// Exhaustive sanity check: every one of the 4^7 combinations returns a valid result.
const ids = ["a2", "b1", "speak", "career"];
let n = 0;
const counts: Record<string, number> = { a2: 0, b1: 0, speak: 0, career: 0 };
for (let k = 0; k < 4 ** 7; k++) {
  const s = Array.from({ length: 7 }, (_, i) => "abcd"[Math.floor(k / 4 ** i) % 4]).join("");
  const r = recommend(pick(s));
  if (!ids.includes(r.primary) || r.primary === r.secondary) { failed++; console.log("INVALID", s, r); }
  if (r.level === "foundation" && (r.primary === "b1" || r.primary === "speak")) { failed++; console.log("ELIGIBILITY", s); }
  counts[r.primary]++; n++;
}
console.log(`Checked ${n} combinations. Primary distribution:`, counts);
if (failed) { console.error(`${failed} check(s) failed`); process.exit(1); }
console.log("All quiz checks passed.");
