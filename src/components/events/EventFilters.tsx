"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { CATEGORY_LABELS, COLLEGE_LABELS } from "@/lib/utils";

const CATEGORIES = Object.entries(CATEGORY_LABELS);
const COLLEGES = Object.entries(COLLEGE_LABELS);

export function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/feed?${params.toString()}`);
    },
    [router, searchParams]
  );

  const active = (key: string, value: string) =>
    searchParams.get(key) === value;

  return (
    <aside className="w-60 flex-shrink-0 space-y-8">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B63] mb-3">
          Category
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateParam("category", null)}
              className={`text-sm w-full text-left py-1 transition-colors ${
                !searchParams.get("category")
                  ? "font-semibold text-[#0F0F0E]"
                  : "text-[#6B6B63] hover:text-[#0F0F0E]"
              }`}
            >
              All categories
            </button>
          </li>
          {CATEGORIES.map(([key, label]) => (
            <li key={key}>
              <button
                onClick={() => updateParam("category", key)}
                className={`text-sm w-full text-left py-1 transition-colors ${
                  active("category", key)
                    ? "font-semibold text-[#C84B31]"
                    : "text-[#6B6B63] hover:text-[#0F0F0E]"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B63] mb-3">
          College
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateParam("college", null)}
              className={`text-sm w-full text-left py-1 transition-colors ${
                !searchParams.get("college")
                  ? "font-semibold text-[#0F0F0E]"
                  : "text-[#6B6B63] hover:text-[#0F0F0E]"
              }`}
            >
              All colleges
            </button>
          </li>
          {COLLEGES.map(([key, label]) => (
            <li key={key}>
              <button
                onClick={() => updateParam("college", key)}
                className={`text-sm w-full text-left py-1 transition-colors ${
                  active("college", key)
                    ? "font-semibold text-[#C84B31]"
                    : "text-[#6B6B63] hover:text-[#0F0F0E]"
                }`}
              >
                {key}
                <span className="text-xs text-[#6B6B63] ml-1 font-normal">
                  {label.split(" ").slice(-1)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B63] mb-3">
          When
        </h3>
        <ul className="space-y-1">
          {[
            { value: null, label: "All upcoming" },
            { value: "week", label: "This week" },
            { value: "month", label: "This month" },
          ].map((opt) => (
            <li key={opt.label}>
              <button
                onClick={() => updateParam("when", opt.value)}
                className={`text-sm w-full text-left py-1 transition-colors ${
                  searchParams.get("when") === opt.value ||
                  (!searchParams.get("when") && !opt.value)
                    ? "font-semibold text-[#0F0F0E]"
                    : "text-[#6B6B63] hover:text-[#0F0F0E]"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={searchParams.get("online") === "true"}
            onChange={(e) =>
              updateParam("online", e.target.checked ? "true" : null)
            }
            className="accent-[#C84B31]"
          />
          <span className="text-sm text-[#6B6B63]">Online only</span>
        </label>
      </div>
    </aside>
  );
}
