"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            蜕
          </span>
          <span className="text-gray-900">蜕羽 AI 服务站</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-4 text-sm">
          <Link
            href="/"
            className="px-2 sm:px-3 py-1 text-gray-700 hover:text-purple-700 rounded-md"
          >
            首页
          </Link>
          <Link
            href="/#products"
            className="px-2 sm:px-3 py-1 text-gray-700 hover:text-purple-700 rounded-md"
          >
            商品
          </Link>
          <Link
            href="/faq"
            className="px-2 sm:px-3 py-1 text-gray-700 hover:text-purple-700 rounded-md"
          >
            常见问题
          </Link>
          <Link
            href="/support"
            className="px-2 sm:px-3 py-1 text-gray-700 hover:text-purple-700 rounded-md"
          >
            售后说明
          </Link>
        </nav>
      </div>
    </header>
  );
}
