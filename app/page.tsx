import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import VideoCard from "@/components/VideoCard/VideoCard";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="fixed top-12 left-0 h-screen z-30">
          <Sidebar />
        </div>
        {/* Main content area (with left margin for sidebar) */}
        <div className="flex-1 ml-60 overflow-y-auto bg-[#0f0f0f]">
          {/* Place your main content here */}
          <div className="grid grid-cols-3 gap-3 p-3">
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
          </div>
        </div>
      </div>
    </div>
  );
}
