import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-20 text-center">
          <div className="inline-block text-xs sm:text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-3 py-1 mb-6">
            中文用户专属承接站
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            AI 工具订阅服务，
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              一页看清
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10">
            提供 GPT Plus 一个月、Gemini 一年等 AI 工具服务说明与下单入口，适合想快速了解和使用主流 AI 工具的中文用户。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="#products"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm hover:from-blue-700 hover:to-purple-700 shadow-sm"
            >
              查看商品
            </Link>
            <Link
              href="/faq"
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50"
            >
              常见问题
            </Link>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">商品列表</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              提供两款主流 AI 工具服务说明与下单入口
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50/50 py-16 sm:py-20 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              为什么选择我们
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              清晰、简单、透明的服务说明与下单体验
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "页面说明清楚",
                desc: "商品信息完整，包含服务说明、注意事项一目了然。",
              },
              {
                title: "下单流程简单",
                desc: "点击立即下单即可跳转到对应支付页面。",
              },
              {
                title: "发货说明明确",
                desc: "发货前请先阅读发货页面说明和规则。",
              },
              {
                title: "售后规则透明",
                desc: "提前告知售后说明，避免理解规则后再进行下单。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-200 rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg mb-3 font-bold text-purple-700">
                  ✓
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-8 text-center">
            <div className="text-sm font-semibold text-amber-800 mb-2">风险提示</div>
            <p className="text-sm text-amber-900 leading-relaxed">
              本站仅提供商品说明、下单入口和售后指引。
              用户购买前请认真阅读商品详情、FAQ 和售后说明。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
