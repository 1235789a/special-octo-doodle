"use client";

import { useState } from "react";

type Props = {
  question: string;
  answer: string;
};

export default function FAQItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-900 font-medium text-sm sm:text-base pr-4">
          {question}
        </span>
        <span className="text-purple-600 text-xl font-light flex-shrink-0">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 text-sm text-gray-700 leading-relaxed border-t border-gray-100 bg-gray-50/50">
          {answer}
        </div>
      )}
    </div>
  );
}
