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

type ThreadComment = Comment & {
  replies?: ThreadComment[];
};

export function CommentSection({
  eventId,
  comments: initialComments,
  isAuthenticated,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [activeTab, setActiveTab] = useState<TabValue>("ALL");
  const [content, setContent] = useState("");
  const [tipType, setTipType] = useState<TipType>("GENERAL");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [error, setError] = useState("");
  const [replyError, setReplyError] = useState("");
  const router = useRouter();

  const { roots, threads } = (() => {
    const threadMap = new Map<string, ThreadComment>();

    comments.forEach((comment) => {
      threadMap.set(comment.id, { ...comment, replies: [] });
    });

    const rootComments: ThreadComment[] = [];

    comments.forEach((comment) => {
      const node = threadMap.get(comment.id);
      if (!node) return;

      if (comment.parentCommentId) {
        const parent = threadMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies = [...(parent.replies ?? []), node];
        } else {
          rootComments.push(node);
        }
      } else {
        rootComments.push(node);
      }
    });

    const sortedRoots = rootComments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const sortReplies = (items: ThreadComment[]): ThreadComment[] =>
      items
        .map((item) => ({
          ...item,
          replies: sortReplies(item.replies ?? []),
        }))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return {
      roots: sortedRoots,
      threads: sortReplies(sortedRoots),
    };
  })();

  const filtered =
    activeTab === "ALL"
      ? threads
      : threads.filter((c) => c.tipType === activeTab);

  async function submitComment(payload: {
    content: string;
    tipType: TipType;
    parentCommentId?: string | null;
  }) {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        content: payload.content.trim(),
        tipType: payload.tipType,
        parentCommentId: payload.parentCommentId ?? null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to post");
    }

    return res.json() as Promise<Comment>;
  }

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
      const newComment = await submitComment({ content, tipType });
      setComments((prev) => [newComment, ...prev]);
      setContent("");
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(parentCommentId: string) {
    if (!replyContent.trim() || replySubmitting) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setReplySubmitting(true);
    setReplyError("");

    try {
      const newComment = await submitComment({
        content: replyContent,
        tipType: "GENERAL",
        parentCommentId,
      });
      setComments((prev) => [newComment, ...prev]);
      setReplyContent("");
      setReplyingTo(null);
    } catch {
      setReplyError("Something went wrong");
    } finally {
      setReplySubmitting(false);
    }
  }

  function renderThread(comment: ThreadComment, depth = 0) {
    const isReply = depth > 0;

    return (
      <div key={comment.id} className={`${depth > 0 ? "ml-6 pl-4 border-l border-[#E8E8E3]" : ""}`}>
        <div className={`border border-[#E8E8E3] bg-white ${isReply ? "p-4" : "p-5"}`}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#E8E8E3] flex items-center justify-center text-sm font-semibold text-[#6B6B63] shrink-0">
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
          <p className="text-sm text-[#0F0F0E] leading-relaxed">{comment.content}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#6B6B63]">
            <span>
              {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  router.push("/login");
                  return;
                }
                setReplyingTo(comment.id);
                setReplyError("");
                setReplyContent("");
              }}
              className="font-semibold text-[#C84B31] hover:underline"
            >
              Reply
            </button>
          </div>
        </div>

        {replyingTo === comment.id && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleReply(comment.id);
            }}
            className="ml-6 mt-3 border border-[#E8E8E3] bg-[#FAFAF7] p-4"
          >
            <textarea
              value={replyContent}
              onChange={(event) => setReplyContent(event.target.value)}
              placeholder={`Reply to ${comment.user?.name ?? "this tip"}`}
              rows={2}
              maxLength={1000}
              className="w-full resize-none border border-[#E8E8E3] bg-white p-3 text-sm focus:border-[#0F0F0E] focus:outline-none"
            />
            {replyError && <p className="mt-2 text-sm text-[#C84B31]">{replyError}</p>}
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-[#6B6B63]">{replyContent.length}/1000</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                    setReplyError("");
                  }}
                  className="text-xs font-semibold text-[#6B6B63] hover:text-[#0F0F0E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replySubmitting || !replyContent.trim()}
                  className="bg-[#0F0F0E] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#C84B31] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {replySubmitting ? "Replying..." : "Post reply"}
                </button>
              </div>
            </div>
          </form>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => renderThread(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F0F0E]">
            Community tips{" "}
            <span className="text-[#6B6B63] font-normal text-base">
              ({comments.length})
            </span>
          </h2>
          <p className="mt-1 text-sm text-[#6B6B63]">
            Short notes, different voices, and replies if you want the extra context.
          </p>
        </div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B6B63]">
          {roots.length} threads
        </div>
      </div>

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
      <form onSubmit={handleSubmit} className="mb-8 border border-[#E8E8E3] bg-white p-5">
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
          filtered.map((comment) => renderThread(comment))
        )}
      </div>
    </div>
  );
}
