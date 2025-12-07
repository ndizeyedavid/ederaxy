import Link from "next/link";

interface IContentNavigation {
  activeTab: "Videos" | "Clips" | "Study Material" | "Courses";
}

export default function ContentNavigation({ activeTab }: IContentNavigation) {
  const contentTabs = [
    { label: "Videos", href: "/dashboard/Teacher/content" },
    { label: "Clips", href: "/dashboard/Teacher/content/clips" },
    {
      label: "Study Material",
      href: "/dashboard/Teacher/content/study-material",
    },
    { label: "Courses", href: "/dashboard/Teacher/content/courses" },
  ];

  return (
    <nav className="overflow-x-auto">
      <div className="flex border-b border-white/10">
        {contentTabs.map(({ label, href }) => {
          const isActive = label === activeTab;
          return (
            <Link
              key={label}
              href={href}
              className={`relative inline-flex items-center whitespace-nowrap px-4 pb-3 pt-2 text-sm font-semibold transition ${
                isActive ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {label}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
