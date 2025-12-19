"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  type AcademicClass,
  type AcademicLevel,
  type ClassCombination,
  type Course,
  type Curriculum,
  type Lesson,
  type Subject,
  type Video,
} from "@/lib/mock/teacherData";

import { listCurriculums } from "@/lib/api/curriculums";
import { listClassCombinations } from "@/lib/api/classCombinations";
import { listAcademicLevels } from "@/lib/api/academicLevels";
import { listAcademicClasses } from "@/lib/api/academicClasses";
import { listCourses } from "@/lib/api/courses";
import { listLessons } from "@/lib/api/lessons";
import { listSubjectsByCurriculum } from "@/lib/api/subjects";

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
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [levels, setLevels] = useState<AcademicLevel[]>([]);
  const [classes, setClasses] = useState<AcademicClass[]>([]);
  const [combinations, setCombinations] = useState<ClassCombination[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const curriculumsRes = await listCurriculums();
        if (cancelled) return;
        setCurriculums(curriculumsRes.curriculums);

        const [
          combosRes,
          levelsRes,
          classesRes,
          coursesRes,
          lessonsRes,
          subjectsRes,
        ] = await Promise.allSettled([
          listClassCombinations(),
          listAcademicLevels(),
          listAcademicClasses(),
          listCourses(),
          listLessons(),
          Promise.all(
            curriculumsRes.curriculums.map((c) =>
              listSubjectsByCurriculum(c._id)
            )
          ),
        ]);

        if (cancelled) return;

        setCombinations(
          combosRes.status === "fulfilled" ? combosRes.value.combinations : []
        );
        setLevels(
          levelsRes.status === "fulfilled" ? levelsRes.value.levels : []
        );
        setClasses(
          classesRes.status === "fulfilled" ? classesRes.value.classes : []
        );
        setCourses(
          coursesRes.status === "fulfilled" ? coursesRes.value.courses : []
        );
        setLessons(
          lessonsRes.status === "fulfilled" ? lessonsRes.value.lessons : []
        );

        if (subjectsRes.status === "fulfilled") {
          const merged = subjectsRes.value.flatMap((r) => r.subjects);
          const byId = new Map<string, Subject>();
          merged.forEach((s) => byId.set(s._id, s));
          setSubjects(Array.from(byId.values()));
        } else {
          setSubjects([]);
        }
      } catch {
        if (cancelled) return;
        setCurriculums([]);
        setCombinations([]);
        setLevels([]);
        setClasses([]);
        setSubjects([]);
        setCourses([]);
        setLessons([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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
