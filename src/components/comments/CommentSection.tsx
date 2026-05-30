"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Comment, TipType } from "@/types";

interface CommentSectionProps {
  eventId: string;
  comments: Comment[];
  isAuthenticated: boolean;
}

const TIP_TYPES: { value: TipType; label: string }[] = [
  { value: "GENERAL", label: "General" },
  { value: "BEST_PART", label: "Best part" },
  { value: "BRING_THIS", label: "Bring this" },
  { value: "SKIP_THIS", label: "Skip this" },
  { value: "TALK_TO", label: "Who to meet" },
];

const TIP_COLORS: Record<TipType, string> = {
  BEST_PART: "text-green-700 border-green-300",
  SKIP_THIS: "text-orange-600 border-orange-300",
  BRING_THIS: "text-blue-600 border-blue-300",
  TALK_TO: "text-purple-600 border-purple-300",
  GENERAL: "text-[#6B6B63] border-[#E8E8E3]",
};

type TabValue = "ALL" | TipType;

export function CommentSection({
  eventId,
  comments: initialComments,
  isAuthenticated,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [activeTab, setActiveTab] = useState<TabValue>("ALL");
  const [content, setContent] = useState("");
  const [tipType, setTipType] = useState<TipType>("GENERAL");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const filtered =
    activeTab === "ALL"
      ? comments
      : comments.filter((c) => c.tipType === activeTab);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, content: content.trim(), tipType }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to post");
        return;
      }

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setContent("");
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">
        Community tips{" "}
        <span className="text-[#6B6B63] font-normal text-base">
          ({comments.length})
        </span>
      </h2>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#E8E8E3] overflow-x-auto">
        {(["ALL", ...TIP_TYPES.map((t) => t.value)] as TabValue[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-[#C84B31] text-[#C84B31]"
                  : "border-transparent text-[#6B6B63] hover:text-[#0F0F0E]"
              }`}
            >
              {tab === "ALL"
                ? "All tips"
                : TIP_TYPES.find((t) => t.value === tab)?.label}
            </button>
          )
        )}
      </div>

      {/* Post a tip */}
      <form onSubmit={handleSubmit} className="mb-8 border border-[#E8E8E3] p-5 bg-white">
        <div className="flex gap-2 mb-3 flex-wrap">
          {TIP_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTipType(t.value)}
              className={`text-xs px-3 py-1 border font-medium transition-colors ${
                tipType === t.value
                  ? "bg-[#0F0F0E] text-white border-[#0F0F0E]"
                  : "border-[#E8E8E3] text-[#6B6B63] hover:border-[#0F0F0E] hover:text-[#0F0F0E]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something useful for the next person who attends this."
          rows={3}
          maxLength={1000}
          className="w-full border border-[#E8E8E3] p-3 text-sm resize-none focus:outline-none focus:border-[#0F0F0E] bg-[#FAFAF7]"
        />
        {error && <p className="text-sm text-[#C84B31] mt-1">{error}</p>}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-[#6B6B63]">
            {content.length}/1000
          </span>
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="bg-[#0F0F0E] text-white px-5 py-2 text-sm font-semibold hover:bg-[#C84B31] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting..." : "Post tip"}
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-[#6B6B63] text-sm py-8 text-center border border-[#E8E8E3]">
            No tips yet. Be the first.
          </p>
        ) : (
          filtered.map((comment) => (
            <div key={comment.id} className="border border-[#E8E8E3] p-5 bg-white">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E8E8E3] flex items-center justify-center text-sm font-semibold text-[#6B6B63] flex-shrink-0">
                    {comment.user?.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none">
                      {comment.user?.name ?? "Anonymous"}
                    </p>
                    <p className="text-xs text-[#6B6B63] mt-0.5">
                      {comment.user?.college}
                    </p>
                  </div>
                </div>
                {comment.tipType && comment.tipType !== "GENERAL" && (
                  <span
                    className={`text-xs font-semibold border px-2 py-0.5 uppercase tracking-wide ${
                      TIP_COLORS[comment.tipType]
                    }`}
                  >
                    {TIP_TYPES.find((t) => t.value === comment.tipType)?.label}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#0F0F0E] leading-relaxed">
                {comment.content}
              </p>
              <p className="text-xs text-[#6B6B63] mt-3">
                {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
