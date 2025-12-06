import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import SearchResultsCard from "@/components/VideoCard/SearchResultsCard";

export default function SearchResultsPage() {
  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col  text-white bg-[#0f0f0f]">
      <Header />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="fixed top-12 left-0 h-screen z-30">
          <Sidebar />
        </div>

        <div className="flex-1 ml-60 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6">
            <SearchResultsCard />
            <SearchResultsCard />
            <SearchResultsCard />
            <SearchResultsCard />
          </div>
        </div>
      </div>
    </main>
  );
}
