import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

interface ClipsControlsProps {
  onPrev?: () => void;
  onNext?: () => void;
  disabledPrev?: boolean;
  disabledNext?: boolean;
}

export default function ClipsContorolls({
  onPrev,
  onNext,
  disabledPrev,
  disabledNext,
}: ClipsControlsProps) {
  return (
    <aside className="flex flex-col items-center">
      <div className="absolute top-[50%] right-5 flex  flex-col items-center gap-3 text-neutral-300">
        {!disabledPrev && (
          <button
            type="button"
            onClick={onPrev}
            disabled={disabledPrev}
            className="flex size-14 items-center justify-center rounded-full bg-[#272727] text-white shadow-lg transition hover:bg-[#535353] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous clip"
          >
            <ArrowUp size={24} />
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={disabledNext}
          className="flex size-14 items-center justify-center rounded-full bg-[#272727] text-white shadow-lg transition hover:bg-[#535353] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next clip"
        >
          <ArrowDown size={24} />
        </button>
      </div>
    </aside>
  );
}
