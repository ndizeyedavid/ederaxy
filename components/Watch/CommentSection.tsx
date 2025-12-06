import Image from "next/image";
import {
  MoreVertical,
  SlidersHorizontal,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

interface CommentItem {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  text: string;
  likes: string;
}

const comments: CommentItem[] = [
  {
    id: "1",
    author: "Sky Puff",
    handle: "@skypuff",
    avatar: "/users/6.png",
    timestamp: "2 days ago",
    text: "Half of this video is an Ad, but at least in the first half I saw something I want to try.",
    likes: "20",
  },
  {
    id: "2",
    author: "Kartik Meow",
    handle: "@kartikmeow",
    avatar: "/users/4.jpg",
    timestamp: "4 days ago",
    text: "Wait am I the only one who found the old VS Code really beautiful??????????",
    likes: "49",
  },
  {
    id: "3",
    author: "Menta F86",
    handle: "@Menta_F86",
    avatar: "/users/2.jpeg",
    timestamp: "5 days ago",
    text: "I saw the terminal video yesterday and hoped to have the same thing for VS and today you release this lol!!! you read my mind!",
    likes: "12",
  },
];

export default function CommentSection() {
  return (
    <section className="rounded-2xl px-6 py-5 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <span>{comments.length} Comments</span>
        </div>
        <button className="flex items-center gap-2 text-sm text-neutral-300 transition hover:text-white">
          <SlidersHorizontal size={18} /> Sort by
        </button>
      </div>

      {/* Add comment */}
      <div className="mt-4 flex items-start gap-3">
        <Image
          src="/users/3.jpeg"
          alt="Your avatar"
          width={40}
          height={40}
          className="size-9 rounded-full object-cover"
        />
        <div className="flex-1">
          <input
            className="w-full border-b border-[#2a2a2a] bg-transparent px-1 py-2 text-sm text-neutral-200 placeholder:text-neutral-400 focus:border-white focus:outline-none"
            placeholder="Add a comment..."
          />
        </div>
      </div>

      {/* Comments list */}
      <div className="mt-10 space-y-6">
        {comments.map((comment) => (
          <article key={comment.id} className="flex gap-3">
            <Image
              src={comment.avatar}
              alt={comment.author}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <span className="font-semibold text-white">
                  {comment.handle}
                </span>
                <span>{comment.timestamp}</span>
              </div>
              <p className="mt-1 text-sm text-neutral-200 leading-relaxed">
                {comment.text}
              </p>
              <div className="mt-3 flex items-center gap-3 text-sm text-neutral-400">
                <button className="flex items-center gap-1 rounded-full px-2 py-1 transition hover:text-white">
                  <ThumbsUp size={16} />
                  <span>{comment.likes}</span>
                </button>
                <button className="flex items-center gap-1 rounded-full px-2 py-1 transition hover:text-white">
                  <ThumbsDown size={16} />
                </button>
                <button className="ml-auto rounded-full p-1 hover:bg-[#2a2a2a]">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
