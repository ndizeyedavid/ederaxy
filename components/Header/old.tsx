import { Bell, Menu, Mic, Search, User } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left side - Menu and Logo */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="p-2">
            <Menu className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-1">
            <div className="relative">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-green-600">Ederax</span>
              <span className="text-xs text-gray-600">Education in hands</span>
            </div>
          </div>
        </div>

        {/* Middle - Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl mx-4">
          <div className="flex flex-1">
            <Input
              placeholder="Search"
              className="rounded-l-full border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button className="rounded-l-none rounded-r-full bg-gray-100 hover:bg-gray-200 text-gray-600 px-4">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="p-2 rounded-full">
            <Mic className="w-5 h-5" />
          </Button>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="p-2">
            <Bell className="w-6 h-6" />
          </Button>

          <Button variant="ghost" size="icon" className="p-1">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
