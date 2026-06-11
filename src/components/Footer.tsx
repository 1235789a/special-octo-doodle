import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <span className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                蜕
              </span>
              <span className="text-gray-900">蜕羽 AI 服务站</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              提供 GPT Plus、Gemini 等 AI 工具服务说明与下单入口。
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">商品与服务</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/products/gpt-plus-month"
                  className="hover:text-purple-700"
                >
                  GPT Plus 一个月
                </Link>
              </li>
              <li>
                <Link
                  href="/products/gemini-year"
                  className="hover:text-purple-700"
                >
                  Gemini 一年
                </Link>
              </li>
              <li>
                <Link href="/#products" className="hover:text-purple-700">
                  查看全部商品
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">帮助与说明</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/faq" className="hover:text-purple-700">
                  常见问题 FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-purple-700">
                  售后说明
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-purple-700">
                  免责声明
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-500 text-center">
          本站仅提供商品说明、下单入口和售后指引。用户购买前请认真阅读商品详情、FAQ 和售后说明。
        </div>
      </div>
    </footer>
  );
}
