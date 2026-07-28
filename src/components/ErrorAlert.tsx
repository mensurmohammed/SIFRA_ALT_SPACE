"use client";

import { AlertCircle } from "lucide-react";
import { cleanErrorMessage } from "@/lib/error-formatter";

interface ErrorAlertProps {
  error?: string | null;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ErrorAlert({
  error,
  fallback = "An error occurred",
  className = "",
  style,
}: ErrorAlertProps) {
  if (!error) return null;

  const formattedMessage = cleanErrorMessage(error, fallback);

  return (
    <div
      className={`flex items-start gap-2.5 px-4 py-3 rounded-[8px] text-sm max-w-full overflow-hidden break-words min-w-0 w-full [overflow-wrap:anywhere] [word-break:break-word] ${className}`}
      style={{
        background: "#FCE4D6",
        color: "#C65911",
        border: "1px solid rgba(198,89,17,0.2)",
        ...style,
      }}
      role="alert"
    >
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#C65911]" />
      <span className="break-words min-w-0 flex-1 leading-snug [overflow-wrap:anywhere] [word-break:break-word]">
        {formattedMessage}
      </span>
    </div>
  );
}
