import CourseSummary from "@/components/Courses/CourseSummary";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import CourseVideoCard from "@/components/VideoCard/CourseVideoCard";
import React from "react";

export default function page() {
  const courseVideos = [
    {
      index: 1,
      title: "#1 - Introduction to the Circulatory System",
      duration: "9:25",
      views: "686K views",
      published: "4 months ago",
      grade: "Primary 5",
      lesson: "Elementary Science and Technology",
      unit: "Unit 1: How our body circulatory system works",
    },
    {
      index: 2,
      title: "#2 - The Heart: Structure and Function",
      duration: "3:11",
      views: "512K views",
      published: "4 months ago",
      grade: "Primary 5",
      lesson: "Elementary Science and Technology",
      unit: "Unit 1: How our body circulatory system works",
    },
    {
      index: 3,
      title: "#3 - Blood Vessels: Arteries, Veins, and Capillaries",
      duration: "13:58",
      views: "472K views",
      published: "4 months ago",
      grade: "Primary 5",
      lesson: "Elementary Science and Technology",
      unit: "Unit 1: How our body circulatory system works",
    },
    {
      index: 4,
      title: "#4 - Blood and Its Components",
      duration: "10:24",
      views: "438K views",
      published: "4 months ago",
      grade: "Primary 5",
      lesson: "Elementary Science and Technology",
      unit: "Unit 1: How our body circulatory system works",
    },
    {
      index: 5,
      title: "#5 - How Blood Circulates Around the Body",
      duration: "13:04",
      views: "402K views",
      published: "4 months ago",
      grade: "Primary 5",
      lesson: "Elementary Science and Technology",
      unit: "Unit 1: How our body circulatory system works",
    },
    {
      index: 6,
      title: "#6 - Keeping the Heart Healthy",
      duration: "8:49",
      views: "389K views",
      published: "4 months ago",
      grade: "Primary 5",
      lesson: "Elementary Science and Technology",
      unit: "Unit 1: How our body circulatory system works",
    },
  ];

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col  text-white bg-[#0f0f0f]">
      <Header />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="fixed top-12 left-0 h-screen z-30">
          <Sidebar />
        </div>

        <div className="flex-1 ml-60 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
              <div className="lg:sticky lg:top-8">
                <CourseSummary />
              </div>
              <section className="flex flex-col gap-4">
                {courseVideos.map((video) => (
                  <CourseVideoCard key={video.index} {...video} />
                ))}
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
