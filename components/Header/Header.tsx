"use client";
import {
  Bell,
  HelpCircle,
  Languages,
  LogOut,
  Menu,
  MessageSquareMoreIcon,
  MessageSquareWarning,
  Mic,
  Moon,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import NotificationCard from "./NotificationCard";

interface ISearchQuery {
  keyword: string;
}

export default function Header() {
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, handleSubmit, setValue } = useForm();

  const search: string = searchParams.get("search") || "";

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        profileRef.current &&
        !profileRef.current.contains(target) &&
        !target.closest("#profile-menu-toggle")
      ) {
        setProfileOpen(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target) &&
        !target.closest("#notifications-toggle")
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleGlobalClick);
    return () => {
      document.removeEventListener("mousedown", handleGlobalClick);
    };
  }, []);

  useEffect(() => {
    setValue("keywoard", search);
  }, [search, setValue]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        // ignore stop errors
      }
    }
    setIsListening(false);
    clearInactivityTimer();
  }, [clearInactivityTimer]);

  const finalizeVoiceSearch = useCallback(
    (shouldSearch: boolean) => {
      clearInactivityTimer();
      const query = (voiceText || transcriptRef.current || "").trim();
      stopListening();
      setVoiceModalOpen(false);

      if (!shouldSearch || !query) {
        return;
      }

      setValue("keywoard", query, { shouldDirty: true });
      router.push(`/results?search=${encodeURIComponent(query)}`);
    },
    [clearInactivityTimer, voiceText, stopListening, setValue, router]
  );

  const scheduleAutoComplete = useCallback(
    (currentTranscript: string) => {
      clearInactivityTimer();

      if (!currentTranscript.trim()) {
        return;
      }

      inactivityTimeoutRef.current = setTimeout(() => {
        finalizeVoiceSearch(true);
      }, 1000);
    },
    [clearInactivityTimer, finalizeVoiceSearch]
  );

  const initialiseRecognition = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }

    if (recognitionRef.current) {
      return true;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        "Speech recognition is not supported in this browser. Please try a modern Chromium or Safari browser."
      );
      return false;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setSpeechError(null);
      setIsListening(true);
    };

    recognition.onerror = (event: any) => {
      const message =
        event.error === "not-allowed"
          ? "Microphone access was denied. Please allow microphone permissions and try again."
          : "We ran into an issue while trying to listen. Please try again.";
      setSpeechError(message);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = transcriptRef.current;
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript = `${finalTranscript} ${transcript}`.trim();
        } else {
          interimTranscript = `${interimTranscript} ${transcript}`.trim();
        }
      }

      transcriptRef.current = finalTranscript;
      const combined = `${finalTranscript} ${interimTranscript}`.trim();
      setVoiceText(combined);
      setValue("keywoard", combined, { shouldDirty: true });
      scheduleAutoComplete(combined);
    };

    recognitionRef.current = recognition;
    return true;
  }, [setValue, scheduleAutoComplete]);

  const startListening = useCallback(() => {
    if (!initialiseRecognition()) {
      return;
    }

    const recognition = recognitionRef.current;

    if (!recognition) {
      return;
    }

    try {
      recognition.stop();
    } catch (error) {
      // ignore if it wasn't running
    }

    transcriptRef.current = voiceText;

    try {
      recognition.start();
    } catch (error) {
      // restart after slight delay if already started
      setTimeout(() => {
        try {
          recognition.start();
        } catch (err) {
          setSpeechError("Unable to start voice capture. Please try again.");
        }
      }, 150);
    }
  }, [initialiseRecognition, voiceText]);

  function searchKeyword(data: any) {
    router.push("/results?search=" + data.keywoard);
  }

  const handleOpenVoiceModal = () => {
    setVoiceText("");
    transcriptRef.current = "";
    clearInactivityTimer();
    setVoiceModalOpen(true);
    startListening();
  };

  const handleCloseVoiceModal = () => {
    stopListening();
    setVoiceModalOpen(false);
  };

  const toggleMicCapture = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const notifications = {
    more: [
      {
        id: "more-1",
        title: "Know Art uploaded: Why Office Chairs Never Run Out of Gas",
        channel: "Know Art",
        timeAgo: "35 minutes ago",
        avatar: "/users/1.jpg",
        thumbnail: "/videos/ai-vs-ml-thumb.jpg",
      },
      {
        id: "more-2",
        title: "UFD Tech uploaded: PS5 Slim Getting Liquid Metal Fix",
        channel: "UFD Tech",
        timeAgo: "3 hours ago",
        avatar: "/users/2.jpeg",
        thumbnail: "/videos/ai-vs-ml-thumb.jpg",
      },
    ],
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-[#0f0f0f] shadow-md relative">
      {/* Left: Logo & Nav */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-[#3f3f3f] cursor-pointer">
          <Menu />
        </button>
        <Link href="/">
          <Image
            src="/logo/logo.png"
            alt="Logo"
            width={120}
            height={60}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex items-center gap-3 w-full max-w-2xl mx-6">
        <form
          onSubmit={handleSubmit(searchKeyword)}
          className="flex items-center w-full border border-[#303030] rounded-full overflow-hidden"
        >
          <Input
            className="bg-transparent! focus-visible:ring-0 border-0 rounded-none text-[#fffff0] font-medium px-4 placeholder:text-[#687575]"
            defaultValue={search}
            placeholder="Search"
            {...register("keywoard")}
          />
          <button
            type="submit"
            className="p-2 w-16 flex items-center justify-center bg-[#222222]/80 cursor-pointer hover:bg-[#222222]"
          >
            <Search />
          </button>
        </form>
        <button
          className="p-2 rounded-full bg-neutral-800 hover:bg-[#3d3d3d] cursor-pointer"
          type="button"
          onClick={handleOpenVoiceModal}
        >
          <Mic size={25} />
        </button>
      </div>

      {/* Right: Notifications, User */}
      <div className="flex items-center gap-3">
        <Link
          href="/message"
          id="notifications-toggle"
          className="p-2 rounded-full hover:bg-[#3d3d3d] cursor-pointer"
          aria-label="messages"
        >
          <MessageSquareMoreIcon />
        </Link>
        <div className="relative">
          <button
            id="notifications-toggle"
            className="p-2 rounded-full hover:bg-[#3d3d3d] cursor-pointer"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Notifications"
          >
            <Bell />
          </button>
          <div className="cursor-pointer absolute top-0 size-4.5 flex items-center justify-center right-1 text-xs font-medium border border-[#010101] text-white bg-red-500 rounded-full">
            3
          </div>
          {notificationsOpen && (
            <div
              ref={notificationsRef}
              className="absolute right-0 z-2000 mt-3 w-[420px] max-h-[520px] overflow-hidden rounded-lg border border-[#2f2f2f] bg-[#282828] shadow-2xl"
            >
              <header className="flex items-center justify-between border-b border-[#2c2c2c] px-5 py-4">
                <div>
                  <p className="text-lg font-semibold text-white">
                    Notifications
                  </p>
                </div>
                <button
                  className="rounded-full p-2 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Notification settings"
                >
                  <Settings size={18} />
                </button>
              </header>
              <div className="custom-scrollbar max-h-[460px] overflow-y-auto">
                <section className="border-t ">
                  <div className="">
                    {notifications.more.map((item) => (
                      <NotificationCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className="size-9 overflow-hidden rounded-full hover:ring-2 hover:ring-green-500"
            onClick={() => setProfileOpen((v) => !v)}
            aria-label="User menu"
          >
            <Image
              src={"/users/1.jpg"}
              width={100}
              height={100}
              alt="Profile picture"
              className="size-full object-cover"
            />
          </button>
          {profileOpen && (
            <div
              ref={profileRef}
              className="absolute right-0 mt-3 w-80 bg-[#232323] rounded-2xl shadow-xl border border-[#303030] z-50 animate-fadeIn"
            >
              <div className="flex flex-col items-center px-6 py-4 border-b border-[#303030]">
                <Image
                  src="/users/1.jpg"
                  alt="David Ndizeye"
                  width={56}
                  height={56}
                  className="rounded-full size-[66px] object-cover mb-2"
                />
                <span className="font-semibold text-lg text-white">
                  David Ndizeye
                </span>
                <span className="text-neutral-400 text-sm">@ndizeyedavid</span>
              </div>
              <div className="flex flex-col divide-y divide-[#303030]">
                <Link
                  href="/settings#profile"
                  className="flex items-center gap-3 px-6 py-3 hover:bg-[#292929] text-white text-base"
                >
                  <User /> My Account
                </Link>
                <button className="flex items-center gap-3 px-6 py-3 hover:bg-[#292929] text-white text-base">
                  <LogOut size={20} /> Sign out
                </button>
                <button className="flex items-center gap-3 px-6 py-3 hover:bg-[#292929] text-white text-base">
                  <Moon size={20} />
                  Appearance: Device theme
                  <span className="ml-auto text-neutral-400">&gt;</span>
                </button>
                <Link
                  href="/settings#languages"
                  className="flex items-center gap-3 px-6 py-3 hover:bg-[#292929] text-white text-base"
                >
                  <Languages size={20} />
                  Display language: English
                  <span className="ml-auto text-neutral-400">&gt;</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-6 py-3 hover:bg-[#292929] text-white text-base"
                >
                  <Settings size={20} />
                  Settings
                </Link>
                <Link
                  href="/help"
                  className="flex items-center gap-3 px-6 py-3 hover:bg-[#292929] text-white text-base"
                >
                  <HelpCircle size={20} />
                  Help
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {voiceModalOpen && (
        <div className="fixed inset-0 z-2000 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 md:px-6">
          <div className="relative w-full max-w-lg rounded-xl border border-white/10 bg-[#141414] p-6 text-white shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 transition hover:bg-white/10 hover:text-white"
              onClick={handleCloseVoiceModal}
              aria-label="Close voice search"
            >
              <X size={18} />
            </button>

            <div className="space-y-6 pt-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                  Voice search
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  {speechError
                    ? "We couldn't start listening"
                    : isListening
                    ? "Listening..."
                    : "Tap the mic to speak"}
                </h2>
                {!speechError && (
                  <p className="mt-2 text-sm text-white/60">
                    {isListening
                      ? "Speak now and watch your words appear in the search field."
                      : voiceText
                      ? "Recording paused. Tap the mic to resume or close to finish."
                      : "When you're ready, tap the mic button below."}
                  </p>
                )}
                {speechError && (
                  <p className="mt-3 text-sm text-red-400">{speechError}</p>
                )}
              </div>

              <div className="min-h-[120px] rounded-2xl border border-white/5 bg-black/30 p-4 text-base text-white/80">
                {voiceText ? (
                  voiceText
                ) : (
                  <span className="text-white/40">
                    Your transcript will appear here...
                  </span>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={toggleMicCapture}
                  className={`relative flex size-20 items-center justify-center rounded-full transition ${
                    isListening ? "bg-green-500" : "bg-[#2f2f2f]"
                  }`}
                  aria-label={
                    isListening ? "Stop listening" : "Start listening"
                  }
                >
                  {isListening && (
                    <span className="absolute -inset-4 rounded-full bg-green-500/20 blur-lg" />
                  )}
                  {isListening && (
                    <span className="absolute h-full w-full scale-75 rounded-full border border-green-400/80 animate-ping" />
                  )}
                  <Mic className="relative z-10" size={28} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
