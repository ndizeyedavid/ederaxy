# Teacher Registration: Frontend vs Backend Field Mapping

This document compares:

- The **current frontend teacher registration wizard** (`app/dashboard/auth/register/page.tsx`)
- The **existing backend user/teacher schema** (as provided)

It highlights:

- Fields already supported by the backend
- Fields currently collected by the UI that are missing on the backend
- Backend fields not yet collected in the UI
- Recommended naming/types for future API wiring

---

## 1) Backend schema (current)

```js
{
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  dob: {
    type: Date,
  },
  nationalId: {
    type: String,
    trim: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: "",
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: /^([a-zA-Z0-9_\-.+])+@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    default: "student",
  },
}
```

---

## 2) Frontend wizard fields (current)

From `TeacherRegisterFormValues`:

- `email`
- `password`
- `confirmPassword`
- `fullName`
- `phone`
- `teacherTitle`
- `yearsExperience`
- `highestQualification`
- `subjects`
- `schoolName`
- `schoolType`
- `country`
- `city`
- `preferredCurriculum`
- `agreeToTerms`

---

## 3) Fields the backend already supports (match)

These exist in both backend schema and frontend UI:

- `fullName`
- `email`
- `password`

Notes:

- Frontend uses `confirmPassword` for validation; backend does not need to store it.
- Backend enforces `password.minlength = 8`, but frontend currently validates `minLength = 6`.

---

## 4) Frontend fields missing on backend (add these if you want to store them)

These are collected by the UI but not present in your backend schema:

- `phone`
- `teacherTitle`
- `yearsExperience`
- `highestQualification`
- `subjects`
- `schoolName`
- `schoolType`
- `country`
- `city`
- `preferredCurriculum`
- `agreeToTerms`

### Suggested backend shapes (recommended)

- `yearsExperience`: `Number` (not string)
- `subjects`:
  - if free-form: `string[]`
  - if linked to DB entities: `ObjectId[]` (recommended long-term)
- `preferredCurriculum`:
  - recommended: `preferredCurriculumId: ObjectId` (instead of a string)
- `agreeToTerms`:
  - recommended to store audit data:
    - `agreedToTermsAt: Date`
    - optional `termsVersion: string`

---

## 5) Backend fields missing in the UI (add these inputs if you want to populate them at registration)

These exist in backend schema but are not yet collected in the current UI:

- `dob`
- `nationalId`
- `profilePicture`
- `bio`
- `role`

Notes:

- `role`: if this is a dedicated **teacher registration** flow, you can simply set `role = "teacher"` server-side and not expose it in the UI.
- `profilePicture`: could be implemented as either:
  - file upload (preferred), or
  - URL field (simple)

---

## 6) Naming/type alignment suggestions (to avoid future refactors)

- **Password policy**: frontend should match backend: `minLength: 8`.
- **Preferred curriculum**: if it comes from DB, align now:
  - UI field should be `preferredCurriculumId`
  - backend field should be `preferredCurriculum: ObjectId` (or `preferredCurriculumId`), consistent with your conventions.
- **Subjects**: decide early:
  - free-form list of strings vs references to `Subject` documents.

---

## 7) Quick “what to change where” checklist

- Backend: add fields (if desired)
  - `phone`, `teacherTitle`, `yearsExperience`, `highestQualification`, `subjects`,
    `schoolName`, `schoolType`, `country`, `city`, `preferredCurriculumId`,
    `agreedToTermsAt` (and optional `termsVersion`).
- Frontend:
  - ensure `password` validation matches backend (`minLength: 8`).
  - when API is ready: submit the wizard values as a registration payload.
