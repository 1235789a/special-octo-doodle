import FAQItem from "@/components/FAQItem";

const faqs = [
  {
    q: "这是官网吗？",
    a: "不是。本站不是 OpenAI、Google 或 Gemini 官方网站，只是中文服务说明和下单承接站。",
  },
  {
    q: "购买后怎么发货？",
    a: "用户点击下单后，会跳转到外部发卡平台或小铺页面，具体发货方式以对应订单页面说明为准。",
  },
  {
    q: "支持退款吗？",
    a: "虚拟商品通常不支持无理由退款。若遇到链接失效、发货异常等问题，可按售后说明提交订单信息处理。",
  },
  {
    q: "我不会使用怎么办？",
    a: "请先阅读商品详情页和发货说明，常见问题会在 FAQ 页面持续更新。",
  },
  {
    q: "GPT Plus 一个月和 Gemini 一年怎么选？",
    a: "短期体验和综合 AI 能力优先选 GPT Plus 一个月；长期使用 Google / Gemini 生态相关能力，可以看 Gemini 一年。",
  },
  {
    q: "会不会受第三方平台规则影响？",
    a: "会。GPT、Gemini 等工具属于第三方平台，具体功能、价格、规则和可用性可能变化，本站会尽量在页面中提示风险。",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-block text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-3 py-1 mb-5">
              FAQ
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              常见问题
            </h1>
            <p className="text-gray-600 text-base">
              购买或使用前，请先查看下方常见问题。
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <FAQItem
                key={i}
                question={`Q${i + 1}：${item.q}`}
                answer={item.a}
              />
            ))}
          </div>

          <div className="mt-12 text-center text-sm text-gray-500">
            更多问题请先阅读商品详情及相关说明。
          </div>
        </div>
      </section>
    </div>
  );
}
