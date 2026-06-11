import Link from "next/link";
import { products, getPayUrl } from "@/data/products";
import CTASection from "@/components/CTASection";

export default function GeminiYearPage() {
  const product = products.find((p) => p.id === "gemini-year");
  if (!product) return null;

  const payUrl = getPayUrl(product);

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航提示 */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 text-xs sm:text-sm text-gray-600">
          <Link href="/" className="hover:text-purple-700">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/#products" className="hover:text-purple-700">商品</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Gemini 一年</span>
        </div>
      </div>

      <section className="py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4">
          {/* 商品标题区 */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {product.price}
              </span>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* 立即下单按钮 */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <a
              href={payUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 shadow-sm"
            >
              立即下单
            </a>
            <Link
              href="/#products"
              className="px-6 py-4 rounded-xl border border-gray-300 text-gray-700 font-medium text-center hover:bg-gray-50"
            >
              返回商品列表
            </Link>
          </div>

          {/* 适合谁 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">适合谁</h2>
            <ul className="space-y-3 text-sm sm:text-base text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center flex-shrink-0">
                  1
                </span>
                想长期使用 Gemini 的用户
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center flex-shrink-0">
                  2
                </span>
                需要学习、办公、资料整理、AI 辅助创作的用户
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center flex-shrink-0">
                  3
                </span>
                希望一次性了解一年使用方案的用户
              </li>
            </ul>
          </div>

          {/* 不适合谁 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">不适合谁</h2>
            <ul className="space-y-3 text-sm sm:text-base text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center flex-shrink-0">
                  ✕
                </span>
                只想短期体验几天的人
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center flex-shrink-0">
                  ✕
                </span>
                对 Google / Gemini 产品完全不了解的人
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center flex-shrink-0">
                  ✕
                </span>
                不能接受第三方平台规则变化的人
              </li>
            </ul>
          </div>

          {/* 你会获得 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">你会获得</h2>
            <ul className="space-y-3 text-sm sm:text-base text-gray-700">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center flex-shrink-0">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* 购买须知 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-amber-900 mb-4">购买须知</h2>
            <ul className="space-y-3 text-sm sm:text-base text-amber-900">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0">●</span>
                虚拟商品购买前请确认需求
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0">●</span>
                下单后按发卡平台或小铺页面说明完成发货
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0">●</span>
                第三方平台规则可能变化，请以实际使用为准
              </li>
            </ul>
          </div>

          {/* 再次强调购买按钮 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center">
            <div className="text-gray-700 mb-4 text-sm">
              已阅读购买须知，了解商品内容？
            </div>
            <a
              href={payUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto sm:min-w-[280px] px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 shadow-sm"
            >
              立即下单
            </a>
            <p className="text-xs text-gray-500 mt-4">
              点击后将跳转到外部支付页面
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
