# Frontend Integration Instructions

This document describes how the frontend client must interact with the Ederaxy backend to support lesson video upload, processing, and playback. Share it directly with any frontend engineer or AI agent before integration begins.

---

## 1. Environment & Authentication

- **API Base URL:** `http://<backend-host>:<port>` (defaults to `http://localhost:8080` in development).
- **Authentication:**
  - Most endpoints require a Bearer JWT in the `Authorization` header: `Authorization: Bearer <token>`.
  - Use the existing auth flows (`/api/v1/auth/login`) to obtain tokens. Tokens encode the user role (`teacher`, `student`, etc.).
  - Video upload endpoints enforce **teacher ownership**. Playback endpoints allow anonymous access but will personalise responses if a token is provided.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

### 1.1 Auth endpoints

#### Register

- **Endpoint:** `POST /api/v1/auth/register`
- **Auth:** None
- **Payload:** JSON

Required fields:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "strong_password_123",
  "role": "student"
}
```

Additional optional profile fields accepted at registration:

```json
{
  "dob": "2000-01-01",
  "nationalId": "123456789012",
  "profilePicture": "https://...",
  "bio": "...",
  "phone": "+2507...",
  "teacherTitle": "Senior Teacher",
  "yearsExperience": 5,
  "highestQualification": "B.Ed",
  "subjects": ["Math", "Physics"],
  "schoolName": "Kigali High School",
  "schoolType": "public",
  "country": "Rwanda",
  "city": "Kigali",
  "preferredCurriculumId": "<Curriculum ObjectId>",
  "agreeToTerms": true,
  "termsVersion": "v1"
}
```

Notes:

- If `role` is `teacher`, `nationalId` is required.
- `yearsExperience` is a number (not string).
- `agreeToTerms` is **not stored directly**; the backend converts it into `agreedToTermsAt`.

#### Login

- **Endpoint:** `POST /api/v1/auth/login`
- **Auth:** None
- **Payload:** JSON

```json
{
  "email": "john@example.com",
  "password": "strong_password_123"
}
```

#### Current user

- **Endpoint:** `GET /api/v1/auth/me`
- **Auth:** Bearer token
- **Response:** `data.user` includes the profile fields listed above.

---

## 2. Response Envelope Pattern

Every JSON response uses the same envelope:

```json
{
  "status": "success" | "error",
  "message": "Human readable status",
  "data": { ... } // optional
}
```

Errors return `status: "error"` and an HTTP status ≥ 400. Validation errors include `data.details` (array of field issues). Always inspect both HTTP status and the `status` field.

---

## 3. Key Domain Concepts

### 3.1 Lesson

| Field    | Type     | Notes                                     |
| -------- | -------- | ----------------------------------------- | ---------------------------------- |
| `id`     | string   | Mongo ObjectId                            |
| `title`  | string   | Lesson title                              |
| `course` | objectId | Linked course; contains teacher reference |
| `video`  | objectId | null                                      | Populated once a video is uploaded |

### 3.2 Video Lifecycle

| Status       | Meaning                        | Frontend Action                          |
| ------------ | ------------------------------ | ---------------------------------------- |
| `uploaded`   | File stored, job pending queue | Show "Queued" state                      |
| `processing` | Worker transcoding             | Show progress indicator, allow polling   |
| `ready`      | HLS complete                   | Display play button and variants         |
| `failed`     | Processing error               | Surface `failureReason`, allow re-upload |

Other important fields returned with video metadata:

- `hlsMasterPlaylistPath`: String path (e.g. `/storage/hls/<uuid>/master.m3u8`) to append to the API base URL for playback.
- `variants`: Array of encodings with `resolution`, `bandwidth`, `playlistPath`, `publicPlaylistPath`.
- `duration`: Duration in seconds (rounded) if detected.
- `jobId`: BullMQ job identifier (optional informational field).

---

## 4. Upload Flow (Teacher)

### Step 1 – Select Target Lesson

Obtain the lesson ID via the lesson list endpoint:

```http
GET /api/v1/lessons?courseId=<courseId>
Authorization: Bearer <teacher-token>
```

### Step 2 – Upload Video

- **Endpoint:** `POST /api/v1/lessons/:lessonId/video`
- **Auth:** Required (teacher)
- **Payload:** `multipart/form-data` with a single field named `video`
- **Accepted MIME Types:** `video/mp4`, `video/quicktime`, `video/avi`, `video/x-matroska`, `video/webm`
- **Max Size:** Controlled by `VIDEO_UPLOAD_MAX_FILE_SIZE` (default 100 MB). Exceeding triggers HTTP 413 or validation error.

Example (fetch):

```js
const form = new FormData();
form.append("video", fileInput.files[0]);

const response = await fetch(`${API_BASE}/api/v1/lessons/${lessonId}/video`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: form,
});

const payload = await response.json();
```

**Success (201):**

```json
{
  "status": "success",
  "message": "Video uploaded successfully",
  "data": {
    "video": {
      "id": "<videoId>",
      "status": "processing",
      "hlsMasterPlaylistPath": null,
      "variants": [],
      "jobId": "<bullmq-job-id>",
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  }
}
```

**Failure Modes:**

- `400` – missing file, unsupported MIME type, or lesson not found / unauthorized.
- `403` – teacher does not own the course that contains the lesson.
- `413` – file exceeds max size.

### Step 2.1 – Upload Thumbnail (optional, recommended)

- **Endpoint:** `POST /api/v1/lessons/:lessonId/video/thumbnail`
- **Auth:** Required (teacher)
- **Payload:** `multipart/form-data` with a single field named `thumbnail`
- **Accepted MIME Types:** `image/jpeg`, `image/png`, `image/webp`, `image/gif`

Example (fetch):

```js
const form = new FormData();
form.append("thumbnail", thumbnailFile);

const response = await fetch(
  `${API_BASE}/api/v1/lessons/${lessonId}/video/thumbnail`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  }
);

const payload = await response.json();
```

The returned `video.thumbnailUrl` is a public path (served under `/storage`) that you can display immediately.

### Step 3 – Poll Processing Status

Because transcoding runs asynchronously in a BullMQ worker, clients must poll until `status === "ready"` or `"failed"`.

- **Endpoint:** `GET /api/v1/lessons/:lessonId/video`
- **Auth:** Optional (teachers + students). Sending a token allows ownership checks, but students may view ready videos without auth.
- **Recommended Poll Interval:** every 5–10 seconds after uploading.

Sample Response (ready):

```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "video": {
      "id": "6942b0219066f63053ab99ca",
      "lesson": "6942aff09066f63053ab99be",
      "status": "ready",
      "hlsMasterPlaylistPath": "/storage/hls/5f7f.../master.m3u8",
      "variants": [
        {
          "resolution": "240p",
          "bandwidth": 550000,
          "playlistPath": "hls/5f7f.../240p.m3u8",
          "publicPlaylistPath": "/storage/hls/5f7f.../240p.m3u8"
        },
        {
          "resolution": "480p",
          "bandwidth": 1200000,
          "playlistPath": "hls/5f7f.../480p.m3u8",
          "publicPlaylistPath": "/storage/hls/5f7f.../480p.m3u8"
        },
        {
          "resolution": "720p",
          "bandwidth": 2800000,
          "playlistPath": "hls/5f7f.../720p.m3u8",
          "publicPlaylistPath": "/storage/hls/5f7f.../720p.m3u8"
        }
      ],
      "duration": 1334,
      "createdAt": "2025-12-17T13:29:05.716Z",
      "updatedAt": "2025-12-17T13:39:10.878Z"
    }
  }
}
```

If `status === "failed"`, inspect `failureReason` (string) and notify the teacher to retry.

---

## 5. Playback Flow (Teacher & Student)

1. Fetch the lesson video metadata as shown above.
2. When `status === "ready"`, derive the master playlist URL:
   - `const masterUrl = new URL(video.hlsMasterPlaylistPath, API_BASE).href;`
   - The backend exposes the storage directory under `/storage`, so the returned path already includes that prefix.
3. Use an HLS-capable player (e.g. Video.js + videojs-http-streaming) to stream `masterUrl`.
4. Optional: allow manual variant selection using `video.variants`. Each item contains a `publicPlaylistPath` that can be appended to the base URL.
5. Handle 404 gracefully—if the playlist path disappears, refresh the metadata.

Example player wiring (Video.js):

```js
player.src({
  src: masterUrl,
  type: "application/x-mpegURL",
});
player.play();
```

### CORS & Static Assets

- The backend mounts `/storage` as a static directory; playlists and TS/segment files reside there.
- Ensure the frontend origin is included in the backend `FRONTEND_ORIGINS` env var to bypass CORS blocks.

---

## 6. Frontend Submission Requirements

When building the integration, ensure the following:

1. **FormData field name** is exactly `video`.
2. **Thumbnail field name** is exactly `thumbnail` (when uploading thumbnails).
3. **Lesson ownership** is validated before making the POST. The endpoint will reject videos for lessons not owned by the teacher.
4. **Retry strategy**: Implement a UI state machine reflecting `uploaded → processing → ready/failed`. Poll until terminal state.
5. **Error surfacing**: Display `message` from error payload, and show `failureReason` if present in video metadata.
6. **Cleanup & re-upload**: If a video fails, teachers should be able to select a new file and re-upload. Old HLS output is automatically cleaned server-side.
7. **Responsive UI**: Provide progress/provisioning indicators. The upload request itself completes quickly; transcoding is async.
8. **Playback fallback**: If HLS is unsupported (rare on desktop), offer a direct download using `/storage/` assets or prompt the user to switch browsers.

---

## 7. Optional UX Enhancements

- **Live status polling**: Display estimated wait times or a simple spinner while `processing`.
- **Variant badges**: Use `resolution` & `bandwidth` to indicate quality options to users.
- **Duration display**: Use `duration` to show the video length once ready.
- **Clipboard helpers**: Provide a "Copy stream URL" button using `navigator.clipboard.writeText(masterUrl)`.
- **Error logging**: Log the BullMQ `jobId` alongside client-side errors for faster support.

---

## 8. Example Integration Timeline

1. **Teacher Auth Flow** – ensure token retrieval.
2. **Lesson Selection UI** – fetch lessons, display status chips if a video exists.
3. **Upload Module** – file picker, `POST /:lessonId/video`, immediate UI state change to `processing`.
4. **Polling Hook** – `setInterval` or background tasks calling `GET /:lessonId/video` until `ready/failed`.
5. **Player Module** – instantiate Video.js (or native HLS) with returned master playlist.
6. **Student View** – show read-only video card that calls the same GET endpoint without requiring login.

---

## 9. Testing Checklist for Frontend Delivery

- [ ] Uploads succeed for valid MIME types and fail gracefully otherwise.
- [ ] Polling stops once `ready` or `failed` is returned.
- [ ] Playback works in Chrome/Firefox/Safari using the master playlist URL.
- [ ] UI surfaces `failureReason` from API when processing fails (simulate by providing a corrupt video).
- [ ] No hard-coded `/storage` prefix in the frontend; rely on API-provided paths.
- [ ] Authorization headers are sent only when required (POST upload & protected views).
- [ ] Lessons without videos display an informative “No video yet” state.

---

## 10. Hand-off Expectations

When the frontend integration is ready for review, the frontend engineer should submit:

1. **Environment config instructions** for setting the API base URL & token sourcing.
2. **UI demo or recordings** showing upload, polling, and playback flows.
3. **Code references** (files/components) responsible for:
   - Upload form submission.
   - Polling logic.
   - Playback setup.
4. **Edge-case handling summary** (e.g., large file errors, failed processing).
5. **Testing notes** verifying the checklist above.

Following this guide ensures smooth collaboration between the backend pipeline and the frontend experience.

## 11. Frontend integration notes

- Upload video first (POST /api/v1/lessons/:lessonId/video with video field)
- Then upload thumbnail (POST /api/v1/lessons/:lessonId/video/thumbnail with thumbnail field)
- After thumbnail upload, call GET /api/v1/lessons/:lessonId/video to refresh UI and read thumbnailUrl
