import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 border-t border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          准备好开始使用 AI 工具了吗？
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          查看商品详情，选择最适合你的方案。下单前请先阅读 FAQ 和售后说明。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/#products"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm hover:from-blue-700 hover:to-purple-700 shadow-sm"
          >
            查看商品
          </Link>
          <Link
            href="/faq"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-white"
          >
            常见问题
          </Link>
        </div>
      </div>
    </section>
  );
}
