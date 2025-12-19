"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  mockCourses,
  mockCurriculums,
  mockClasses,
  mockCombinations,
  mockLessons,
  mockLevels,
  mockSubjects,
  mockVideos,
  type AcademicClass,
  type AcademicLevel,
  type ClassCombination,
  type Course,
  type Curriculum,
  type Lesson,
  type Subject,
  type Video,
} from "@/lib/mock/teacherData";

interface TeacherContentStore {
  curriculums: Curriculum[];
  setCurriculums: React.Dispatch<React.SetStateAction<Curriculum[]>>;

  levels: AcademicLevel[];
  setLevels: React.Dispatch<React.SetStateAction<AcademicLevel[]>>;

  classes: AcademicClass[];
  setClasses: React.Dispatch<React.SetStateAction<AcademicClass[]>>;

  combinations: ClassCombination[];
  setCombinations: React.Dispatch<React.SetStateAction<ClassCombination[]>>;

  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;

  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;

  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;

  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
}

const TeacherContentContext = createContext<TeacherContentStore | null>(null);

export function TeacherContentProvider({ children }: { children: ReactNode }) {
  const [curriculums, setCurriculums] = useState<Curriculum[]>(mockCurriculums);
  const [levels, setLevels] = useState<AcademicLevel[]>(mockLevels);
  const [classes, setClasses] = useState<AcademicClass[]>(mockClasses);
  const [combinations, setCombinations] =
    useState<ClassCombination[]>(mockCombinations);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [videos, setVideos] = useState<Video[]>(mockVideos);

  const value = useMemo<TeacherContentStore>(
    () => ({
      curriculums,
      setCurriculums,
      levels,
      setLevels,
      classes,
      setClasses,
      combinations,
      setCombinations,
      subjects,
      setSubjects,
      courses,
      setCourses,
      lessons,
      setLessons,
      videos,
      setVideos,
    }),
    [
      curriculums,
      levels,
      classes,
      combinations,
      subjects,
      courses,
      lessons,
      videos,
    ]
  );

  return (
    <TeacherContentContext.Provider value={value}>
      {children}
    </TeacherContentContext.Provider>
  );
}

export function useTeacherContentStore() {
  const store = useContext(TeacherContentContext);
  if (!store) {
    throw new Error(
      "useTeacherContentStore must be used within TeacherContentProvider"
    );
  }
  return store;
}
