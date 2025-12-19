export type ObjectIdString = string;

export interface User {
  _id: ObjectIdString;
  firstName: string;
  lastName: string;
  email: string;
  role: "teacher" | "student" | "admin";
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Curriculum {
  _id: ObjectIdString;
  title: string;
  description?: string;
  country?: string;
  createdBy: ObjectIdString;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicLevel {
  _id: ObjectIdString;
  title: string;
  description?: string;
  curriculum: ObjectIdString;
  order: number;
  createdBy: ObjectIdString;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicClass {
  _id: ObjectIdString;
  title: string;
  description?: string;
  curriculum: ObjectIdString;
  academicLevel: ObjectIdString;
  createdBy: ObjectIdString;
  createdAt: string;
  updatedAt: string;
}

export interface ClassCombination {
  _id: ObjectIdString;
  title: string;
  description?: string;
  subjects: ObjectIdString[];
  createdBy: ObjectIdString;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  _id: ObjectIdString;
  title: string;
  description?: string;
  curriculum: ObjectIdString;
  targetLevels?: ObjectIdString[];
  targetClasses?: ObjectIdString[];
  targetCombinations?: ObjectIdString[];
  createdBy: ObjectIdString;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  _id: ObjectIdString;
  title: string;
  description?: string;
  subject: ObjectIdString;
  teacher: ObjectIdString;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LessonResource {
  label: string;
  url: string;
}

export interface Lesson {
  _id: ObjectIdString;
  title: string;
  description?: string;
  order: number;
  course: ObjectIdString;
  resources?: LessonResource[];
  video?: ObjectIdString | null;
  createdAt: string;
  updatedAt: string;
}

export type VideoStatus = "uploaded" | "processing" | "ready" | "failed";

export interface VideoVariant {
  resolution: string;
  bandwidth: number;
  playlistPath: string;
  publicPlaylistPath: string;
}

export interface Video {
  _id: ObjectIdString;
  lesson: ObjectIdString;
  uploadedBy: ObjectIdString;
  originalFileName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  originalPath: string;
  hlsDirectory: string;
  hlsMasterPlaylistPath: string | null;
  variants: VideoVariant[];
  duration: number | null;
  status: VideoStatus;
  failureReason?: string;
  jobId?: string;
  processingStartedAt?: string;
  processingCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockTeacher: User = {
  _id: "674f1f5f1c1a1c1a1c1a1c1a",
  firstName: "Kabutore",
  lastName: "Boniface",
  email: "teacher@ederaxy.dev",
  role: "teacher",
  isEmailVerified: true,
  createdAt: "2025-11-01T10:12:00.000Z",
  updatedAt: "2025-12-10T15:32:00.000Z",
};

export const mockCurriculums: Curriculum[] = [
  {
    _id: "674f20001c1a1c1a1c1a1c1b",
    title: "Rwanda REB",
    description: "National curriculum structure (REB).",
    country: "Rwanda",
    createdBy: mockTeacher._id,
    createdAt: "2025-10-18T12:00:00.000Z",
    updatedAt: "2025-12-02T09:00:00.000Z",
  },
  {
    _id: "674f20001c1a1c1a1c1a1c1c",
    title: "Cambridge",
    description: "International curriculum (Cambridge).",
    country: "International",
    createdBy: mockTeacher._id,
    createdAt: "2025-10-20T12:00:00.000Z",
    updatedAt: "2025-12-02T09:00:00.000Z",
  },
];

export const mockLevels: AcademicLevel[] = [
  {
    _id: "674f21001c1a1c1a1c1a1c11",
    title: "Primary",
    curriculum: mockCurriculums[0]._id,
    order: 1,
    createdBy: mockTeacher._id,
    createdAt: "2025-10-18T12:05:00.000Z",
    updatedAt: "2025-12-02T09:00:00.000Z",
  },
  {
    _id: "674f21001c1a1c1a1c1a1c12",
    title: "O'Level",
    curriculum: mockCurriculums[0]._id,
    order: 2,
    createdBy: mockTeacher._id,
    createdAt: "2025-10-18T12:06:00.000Z",
    updatedAt: "2025-12-02T09:00:00.000Z",
  },
  {
    _id: "674f21001c1a1c1a1c1a1c13",
    title: "A'Level",
    curriculum: mockCurriculums[0]._id,
    order: 3,
    createdBy: mockTeacher._id,
    createdAt: "2025-10-18T12:07:00.000Z",
    updatedAt: "2025-12-02T09:00:00.000Z",
  },
];

export const mockClasses: AcademicClass[] = [
  {
    _id: "674f22001c1a1c1a1c1a1c21",
    title: "P4",
    curriculum: mockCurriculums[0]._id,
    academicLevel: mockLevels[0]._id,
    createdBy: mockTeacher._id,
    createdAt: "2025-10-18T12:10:00.000Z",
    updatedAt: "2025-12-02T09:00:00.000Z",
  },
  {
    _id: "674f22001c1a1c1a1c1a1c22",
    title: "S1",
    curriculum: mockCurriculums[0]._id,
    academicLevel: mockLevels[1]._id,
    createdBy: mockTeacher._id,
    createdAt: "2025-10-18T12:11:00.000Z",
    updatedAt: "2025-12-02T09:00:00.000Z",
  },
];

export const mockSubjects: Subject[] = [
  {
    _id: "674f23001c1a1c1a1c1a1c31",
    title: "Software Development",
    description: "Practical coding skills, fundamentals, and projects.",
    curriculum: mockCurriculums[0]._id,
    targetLevels: [mockLevels[1]._id, mockLevels[2]._id],
    targetClasses: [mockClasses[1]._id],
    createdBy: mockTeacher._id,
    createdAt: "2025-10-22T08:00:00.000Z",
    updatedAt: "2025-12-02T09:00:00.000Z",
  },
  {
    _id: "674f23001c1a1c1a1c1a1c32",
    title: "Mathematics",
    description: "Core numeracy, algebra and geometry.",
    curriculum: mockCurriculums[0]._id,
    targetLevels: [mockLevels[0]._id, mockLevels[1]._id],
    targetClasses: [mockClasses[0]._id, mockClasses[1]._id],
    createdBy: mockTeacher._id,
    createdAt: "2025-10-22T08:10:00.000Z",
    updatedAt: "2025-12-02T09:00:00.000Z",
  },
];

export const mockCourses: Course[] = [
  {
    _id: "674f24001c1a1c1a1c1a1c41",
    title: "Intro to AI & Machine Learning",
    description: "Build intuition, then implement small projects.",
    subject: mockSubjects[0]._id,
    teacher: mockTeacher._id,
    isPublished: true,
    createdAt: "2025-11-10T10:00:00.000Z",
    updatedAt: "2025-12-15T10:00:00.000Z",
  },
  {
    _id: "674f24001c1a1c1a1c1a1c42",
    title: "Algebra Mastery",
    description: "Foundations and practice sets.",
    subject: mockSubjects[1]._id,
    teacher: mockTeacher._id,
    isPublished: false,
    createdAt: "2025-11-18T10:00:00.000Z",
    updatedAt: "2025-12-11T10:00:00.000Z",
  },
];

export const mockLessons: Lesson[] = [
  {
    _id: "674f25001c1a1c1a1c1a1c51",
    title: "What is Machine Learning?",
    description: "Definitions, examples, and pitfalls.",
    order: 1,
    course: mockCourses[0]._id,
    resources: [
      { label: "Slides", url: "https://example.com/slides/ml-intro" },
      { label: "Worksheet", url: "https://example.com/worksheet/ml-intro" },
    ],
    video: "674f26001c1a1c1a1c1a1c61",
    createdAt: "2025-12-01T08:00:00.000Z",
    updatedAt: "2025-12-01T08:00:00.000Z",
  },
  {
    _id: "674f25001c1a1c1a1c1a1c52",
    title: "Supervised vs Unsupervised",
    description: "Clustering, classification and evaluation.",
    order: 2,
    course: mockCourses[0]._id,
    video: "674f26001c1a1c1a1c1a1c62",
    createdAt: "2025-12-02T08:00:00.000Z",
    updatedAt: "2025-12-02T08:00:00.000Z",
  },
  {
    _id: "674f25001c1a1c1a1c1a1c53",
    title: "K-Means Lab",
    description: "Hands-on clustering lab.",
    order: 3,
    course: mockCourses[0]._id,
    video: null,
    createdAt: "2025-12-03T08:00:00.000Z",
    updatedAt: "2025-12-03T08:00:00.000Z",
  },
  {
    _id: "674f25001c1a1c1a1c1a1c54",
    title: "Algebra Warm-up",
    description: "Prepare the class for equations.",
    order: 1,
    course: mockCourses[1]._id,
    video: "674f26001c1a1c1a1c1a1c63",
    createdAt: "2025-12-10T08:00:00.000Z",
    updatedAt: "2025-12-10T08:00:00.000Z",
  },
];

export const mockVideos: Video[] = [
  {
    _id: "674f26001c1a1c1a1c1a1c61",
    lesson: mockLessons[0]._id,
    uploadedBy: mockTeacher._id,
    originalFileName: "ml-intro.mp4",
    mimeType: "video/mp4",
    size: 42_000_000,
    storageKey: "5f7f00000000000000000001",
    originalPath: "uploads/5f7f00000000000000000001/ml-intro.mp4",
    hlsDirectory: "hls/5f7f00000000000000000001",
    hlsMasterPlaylistPath: "/storage/hls/5f7f00000000000000000001/master.m3u8",
    variants: [
      {
        resolution: "240p",
        bandwidth: 550000,
        playlistPath: "hls/5f7f00000000000000000001/240p.m3u8",
        publicPlaylistPath: "/storage/hls/5f7f00000000000000000001/240p.m3u8",
      },
      {
        resolution: "480p",
        bandwidth: 1200000,
        playlistPath: "hls/5f7f00000000000000000001/480p.m3u8",
        publicPlaylistPath: "/storage/hls/5f7f00000000000000000001/480p.m3u8",
      },
      {
        resolution: "720p",
        bandwidth: 2800000,
        playlistPath: "hls/5f7f00000000000000000001/720p.m3u8",
        publicPlaylistPath: "/storage/hls/5f7f00000000000000000001/720p.m3u8",
      },
    ],
    duration: 1334,
    status: "ready",
    createdAt: "2025-12-01T08:15:00.000Z",
    updatedAt: "2025-12-01T08:39:10.000Z",
  },
  {
    _id: "674f26001c1a1c1a1c1a1c62",
    lesson: mockLessons[1]._id,
    uploadedBy: mockTeacher._id,
    originalFileName: "supervised-unsupervised.mov",
    mimeType: "video/quicktime",
    size: 87_500_000,
    storageKey: "5f7f00000000000000000002",
    originalPath:
      "uploads/5f7f00000000000000000002/supervised-unsupervised.mov",
    hlsDirectory: "hls/5f7f00000000000000000002",
    hlsMasterPlaylistPath: null,
    variants: [],
    duration: null,
    status: "processing",
    jobId: "bull-job-123",
    processingStartedAt: "2025-12-02T08:16:00.000Z",
    createdAt: "2025-12-02T08:15:00.000Z",
    updatedAt: "2025-12-02T08:16:00.000Z",
  },
  {
    _id: "674f26001c1a1c1a1c1a1c63",
    lesson: mockLessons[3]._id,
    uploadedBy: mockTeacher._id,
    originalFileName: "algebra-warmup.mp4",
    mimeType: "video/mp4",
    size: 11_200_000,
    storageKey: "5f7f00000000000000000003",
    originalPath: "uploads/5f7f00000000000000000003/algebra-warmup.mp4",
    hlsDirectory: "hls/5f7f00000000000000000003",
    hlsMasterPlaylistPath: null,
    variants: [],
    duration: null,
    status: "failed",
    failureReason: "FFmpeg exited with code 1 while probing file.",
    jobId: "bull-job-124",
    processingStartedAt: "2025-12-10T08:10:00.000Z",
    processingCompletedAt: "2025-12-10T08:11:00.000Z",
    createdAt: "2025-12-10T08:09:00.000Z",
    updatedAt: "2025-12-10T08:11:00.000Z",
  },
];

export function getSubjectById(subjectId: ObjectIdString) {
  return mockSubjects.find((subject) => subject._id === subjectId) ?? null;
}

export function getCurriculumById(curriculumId: ObjectIdString) {
  return (
    mockCurriculums.find((curriculum) => curriculum._id === curriculumId) ??
    null
  );
}

export function getCourseById(courseId: ObjectIdString) {
  return mockCourses.find((course) => course._id === courseId) ?? null;
}

export function getLessonsForCourse(courseId: ObjectIdString) {
  return mockLessons
    .filter((lesson) => lesson.course === courseId)
    .slice()
    .sort((a, b) => a.order - b.order);
}

export function getVideoForLesson(lessonId: ObjectIdString) {
  return mockVideos.find((video) => video.lesson === lessonId) ?? null;
}
