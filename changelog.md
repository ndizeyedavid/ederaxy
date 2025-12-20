# Teacher Content — Changelog

## Video Previews (Main Videos Page)

- **Added Preview column** to the main “Lesson videos” table (`app/dashboard/Teacher/content/page.tsx`).
- **Preview button** opens a modal with an inline HTML5 video player.
- **Backend URL resolution**: prefixes relative URLs with `NEXT_PUBLIC_API_BASE_URL`.
- **Supports HLS/MP4** by checking variants, HLS master playlist, and original path, in order.
- **Fallback link**: “Open in new tab” in the modal header for browsers that don’t play HLS inline.

## Course Detail Page — Lesson Preview

- **Replaced “Upload video”** with “Preview” on lesson cards when a video exists (`app/dashboard/Teacher/content/courses/[courseId]/page.tsx`).
- **Preview modal** mirrors the main Videos page (same UI, URL resolution, HLS/MP4 support).
- **Conditional button**: shows “Preview” when video is available; otherwise shows “Upload video”.
- **Added `resolveBackendUrl` helper** to prefix API base URL for thumbnails and video URLs.

## AgGrid Dark Theme Fixes

- **Main Videos table** was rendering white because AgGrid styles were scoped.
- **Made styles global** (`<style jsx global>`) and forced dark backgrounds on internal wrappers/viewport.
- **Aligned grid props** with Courses page (`rowHeight`, `headerHeight`, `suppressDragLeaveHidesColumns`, `theme="legacy"`).
- **Consistent wrapper**: `ag-theme-quartz content-ag-grid h-[520px] rounded border border-white/5`.

## Data Fetching & Normalization

- **API client normalization helpers** (`lib/api/normalize.ts`): `getId()` and `getIdArray()` to extract string IDs from nested backend objects.
- **Updated all API clients** (`academicClasses`, `academicLevels`, `subjects`, `courses`, `lessons`, `classCombinations`, `curriculums`) to use these helpers.
- **Per-course lessons fetching** in `TeacherContentProvider` to avoid 404 on global lessons endpoint.
- **Per-lesson video metadata fetching** in both main Videos page and course detail page, merging into the store.

## Upload Video Wizard Fixes

- **Fixed thumbnail upload 404** by adding retry/polling: wait for video record creation before thumbnail upload.
- **Breadcrumb UI** added to the upload wizard for clearer navigation.

## UI/UX Improvements

- **Fixed JSX/TS errors** in ContentNavigation and page components.
- **Consistent dark theme** across all AgGrid tables (Videos, Courses, Clips, Study Material).
- **Video status badges** and duration display on both tables and lesson cards.
- **Responsive hover states** and button styling consistency.

## Technical Details

- **Backend URL prefixing**: `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8080`).
- **Video URL preference order**: `variants[0].publicPlaylistPath` → `hlsMasterPlaylistPath` → `originalPath`.
- **Error handling**: 404s ignored gracefully when fetching per-lesson videos.
- **Store merging**: uses Maps to dedupe by `_id` when updating lessons/videos.

---

### Files Changed

- `app/dashboard/Teacher/content/page.tsx`
- `app/dashboard/Teacher/content/courses/[courseId]/page.tsx`
- `components/TeacherContent/TeacherContentProvider.tsx`
- `lib/api/normalize.ts`
- `lib/api/academicClasses.ts`
- `lib/api/academicLevels.ts`
- `lib/api/subjects.ts`
- `lib/api/courses.ts`
- `lib/api/lessons.ts`
- `lib/api/classCombinations.ts`
- `lib/api/curriculums.ts`
- `app/dashboard/Teacher/content/upload-video/page.tsx`

---

### Next Steps (Pending)

- Add explicit “Choose an option” placeholders to all select inputs and submit guards to prevent empty IDs.
- Verify tables/pages relying on store arrays populate correctly; add per-page fetches only if an endpoint is missing.
