# Bridge Academy website

The website for **Bridge Academy**, the educational initiative of EduBridge.
Georgian (default) and English, with course pages, the **Find Your Bridge** quiz and an application form.

Built with Next.js 14 (App Router), TypeScript and Tailwind CSS. There is no database in this project.
Applications are passed to a server-side webhook that you configure.

---

## 1. Run it locally

You need **Node.js 20 or newer**.

```bash
npm install
cp .env.example .env.local   # optional, see section 6
npm run dev                  # http://localhost:3000  (redirects to /ka)
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build. Catches type errors and missing translations. |
| `npm start` | Serves the production build. |
| `npm run typecheck` | TypeScript check only. |
| `npm run test:quiz` | Tests the quiz logic, including all 16,384 answer combinations. |

**Deploying.** The site needs a Node server for `/api/apply` and the language redirect.
Vercel works with no extra configuration. Netlify, Render, Railway or any Node host work too.
Set the environment variables from `.env.example` in your host's dashboard.

---

## 2. Where things live

```
src/
  config/site.ts            ← contact details, links, student portal, photos
  content/
    courses.ts              ← ALL course information (both languages)
    quiz.ts                 ← quiz questions, scoring weights, result texts
    instructors.ts          ← instructor profiles (empty = placeholders shown)
    dictionaries/ka.ts      ← Georgian interface text
    dictionaries/en.ts      ← English interface text
  lib/
    recommend.ts            ← quiz recommendation algorithm (pure, deterministic)
    application.ts          ← form validation (shared by browser and server)
    i18n.ts, seo.ts         ← language helpers, page metadata
  app/[locale]/…            ← pages (/ka/…, /en/…)
  app/api/apply/route.ts    ← receives applications
  components/…              ← reusable UI
tailwind.config.ts          ← brand colours, fonts, radii, shadows
```

**Golden rule.** Only confirmed facts go in as plain text. If something isn't final, leave it `null`
or mark it `tbc`. The site will then show "To be added" or "Subject to confirmation" instead of an invented value.

---

## 3. Updating courses

Everything about a course is in **`src/content/courses.ts`**. One edit there updates the course card,
the course page, the application form, the footer, the sitemap and the quiz result links.

### Status, dates, fees, application link

Each course has these fields at the top:

```ts
status: "applications-opening-soon",  // or "coming-soon" | "open" | "closed"
startDate: null,                      // e.g. "2027-02-01"  → shown on the course page
applicationDeadline: null,            // e.g. "2027-01-15"
fee: null,                            // e.g. { ka: "250 ₾ / თვე", en: "₾250 / month" }
externalApplicationUrl: null,         // e.g. a Google Form link; null = use the on-site form
```

The badge text for each status is in the dictionaries under `status`.

### Marking something as "subject to confirmation"

In any list, wrap the item with `tbc(...)`:

```ts
resources: {
  ka: ["…", tbc("ძირითადი სახელმძღვანელო")],
  en: ["…", tbc("Core coursebook")],
},
```

Once it's confirmed, replace `tbc("…")` with the plain text.

Facts (duration, group size…) use `tbc: true`:

```ts
{ key: "frequency", value: { ka: "კვირაში 2-ჯერ", en: "Twice a week" } }            // confirmed
{ key: "frequency", value: { ka: "დასაზუსტებელია", en: "To be confirmed" }, tbc: true } // not yet
```

### Adding a new course

1. Copy one course object in `courses.ts` and give it a new `id` and `slug`.
2. Add the new `id` to the `CourseId` type at the top of the file.
3. If it should be a quiz result, add weights for it in `quiz.ts` and an entry in `resultCopy`.
   Then add it to `COURSE_ORDER` in `lib/recommend.ts`.
4. Run `npm run build`. TypeScript will point to anything that's missing.

---

## 4. Contact details, links, photos, instructors

Edit **`src/config/site.ts`**:

```ts
contact: {
  email: "hello@example.ge",
  phone: "+995 5XX XX XX XX",
  address: { ka: "თბილისი, საქართველო", en: "Tbilisi, Georgia" },
  hours: { ka: "ორშ–პარ, 10:00–18:00", en: "Mon–Fri, 10:00–18:00" },
},
links: {
  studentPortal: "https://classroom.google.com/…",  // appears in footer, menu, How it works
  eduBridge: "https://…",
  facebook: "https://…", instagram: null, linkedin: null,
},
images: {
  about: "/images/about.jpg",      // put files in /public/images
  community: "/images/community.jpg",
},
```

Anything left `null` shows as a dashed "To be added" chip.
Use real photos of your own learners, with their consent, and avoid stock photos.

**Instructors.** Add confirmed profiles to `src/content/instructors.ts`. The example format is in the file.
While the list is empty, clearly labelled placeholder cards are shown.

---

## 5. Text and translations

- Interface text is in `src/content/dictionaries/ka.ts` and `en.ts`. Both files must have the same keys.
  The build fails if one is missing.
- Course text is in `courses.ts` and quiz text is in `quiz.ts`. Both use `{ ka: "…", en: "…" }`.
- Georgian is the default language. `/` redirects to `/ka`, or to the last language the visitor chose.

---

## 6. Connecting the application form

Out of the box the form runs in **demo mode**. It checks every field, but it clearly tells the applicant
that nothing was sent. It never claims an application was received unless a backend confirms it saved it.

To receive real applications, set these variables on the server:

```
APPLICATIONS_WEBHOOK_URL=https://…        # required
APPLICATIONS_WEBHOOK_SECRET=some-long-random-string   # optional, sent as X-Webhook-Secret
```

`/api/apply` validates the data again on the server, then sends this JSON to the URL with a `POST` request:

```json
{
  "fullName": "…", "email": "…", "dob": "2008-05-01", "course": "bridge-speak",
  "level": "a2", "goals": "…", "schedule": ["weekend"], "consent": true,
  "guardianName": "…", "guardianEmail": "…", "guardianConsent": true,
  "locale": "ka", "submittedAt": "2026-…", "source": "bridge-academy-website"
}
```

The applicant only sees "Application received" if your endpoint returns a 2xx status.
Any other response shows an error and asks them to try again.

**Google Sheets example (Apps Script).**
Create a Sheet, then go to *Extensions → Apps Script*, paste the code below, and choose
*Deploy → Web app* (execute as you, access "Anyone").
Use the web-app URL as `APPLICATIONS_WEBHOOK_URL`.

```js
const SECRET = "same value as APPLICATIONS_WEBHOOK_SECRET";
function doPost(e) {
  // Apps Script cannot read request headers, so for Sheets put the secret in the URL instead:
  // APPLICATIONS_WEBHOOK_URL=https://script.google.com/…/exec?key=YOUR_SECRET
  if (e.parameter.key !== SECRET) return ContentService.createTextOutput("forbidden");
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActive().getSheets()[0].appendRow([
    d.submittedAt, d.fullName, d.email, d.dob, d.course, d.level, d.goals,
    d.schedule.join(", "), d.guardianName, d.guardianEmail, d.guardianConsent, d.locale,
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }));
}
```

Before collecting real data, protect the Sheet and limit who can open it. Then update the Privacy page.

**Security notes.**
- Credentials only ever live in server environment variables. Nothing secret is sent to the browser.
- A hidden "honeypot" field filters out simple bots.
- Before launch, consider adding rate limiting (for example via your host) or a CAPTCHA if you get spam.
- The guardian-consent step for under-18s is a **placeholder pending legal review**.

---

## 7. The Find Your Bridge quiz

- Questions, answers and weights are in `src/content/quiz.ts`. Each answer gives 0–3 points to each course.
  Each question has an `importance` multiplier. Learning goal (×3), current English (×3) and main
  challenge (×2.5) count most.
- The algorithm in `src/lib/recommend.ts` has no randomness, so the same answers always give the same result.
  Ties go to the course the learner's goal pointed to.
- **Entry check.** If someone chooses "I know simple words and expressions" but their answers point to
  B1 or Bridge Speak, they are recommended A2 first. The result explains that a formal placement check is needed,
  and their original match is shown as the next step.
- A second suggestion appears when another course scores at least 60% of the top score.
- The quiz runs entirely in the browser. It stores nothing and needs no registration.
  It is advisory only, and the result screen says so.
- After changing weights, run `npm run test:quiz`.

---

## 8. Design system

- **Colours** (`tailwind.config.ts`): forest `#1E3B2C`, sage `#8EA88A`, ivory `#F7F5EE`, gold `#C49A3F`, ink `#18261E`.
- **Type.** Noto Serif Georgian for headings and Noto Sans Georgian for body text. Both are self-hosted variable fonts
  via `@fontsource-variable`, so there are no external font requests.
- **Components.** Buttons use the `.btn` + `.btn-primary | .btn-gold | .btn-outline` classes. Form fields use `.field`.
  Badges are `StatusBadge`, `TbcBadge` and `PlaceholderChip`. Reusable pieces include `CourseCard`, `FaqList`,
  `PageHeader`, `ImageSlot` and `Journey`.
- **Motion.** The hero bridge builds itself once when the page loads, and the learning-journey line draws once when
  scrolled into view. All motion is turned off for visitors who have "reduce motion" switched on.

---

## 9. Before going live — checklist

- [ ] Real contact details, links and photos in `src/config/site.ts`
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain (used for SEO and the sitemap)
- [ ] Course statuses, dates and fees updated; remaining `tbc` items reviewed
- [ ] Application webhook connected and tested end to end
- [ ] Privacy Policy and Terms written by a qualified legal adviser (currently placeholders)
- [ ] Guardian-consent process for minors reviewed legally
- [ ] Instructor profiles added (or the Instructors link hidden)
- [ ] Georgian copy proofread by a native speaker

## 10. Room to grow

The structure is ready for:
- **Payments.** Add a server route (for example a Stripe or Georgian bank checkout) and a `fee` field per course.
- **Applications database.** Replace the webhook call in `app/api/apply/route.ts` with your database client.
- **Student dashboard.** Add `app/[locale]/dashboard` behind authentication.
  Until then, `links.studentPortal` points to Google Classroom.
