export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-block text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-3 py-1 mb-5">
              Disclaimer
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              免责声明
            </h1>
            <p className="text-gray-600 text-base">
              请在使用本站服务前仔细阅读以下内容。
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                1. 本站与第三方平台的关系
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                本站不隶属于 OpenAI、Google、Gemini 或其他第三方平台，也不是这些平台的官方渠道。本站独立运营，仅提供中文商品说明、下单入口和售后指引服务。
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                2. 本站提供的服务
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                本站仅提供中文商品说明、下单入口和售后指引，帮助中文用户更清楚地了解和使用相关 AI 工具相关服务。
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                3. 第三方平台规则变化
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                第三方平台的功能、价格、规则、可用性可能随时间变化，本站会尽量在商品说明页面提示相关风险，但不承担因第三方平台规则变化造成的任何影响。
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                4. 用户使用责任
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                用户在使用相关第三方平台时，应自行遵守其服务条款、使用规则和所在地区的相关法律法规，不得用于违反相关条款的用途。
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                5. 环境与体验差异
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                因用户自身设备、网络环境、账号状态、所在地区等差异可能带来的体验差异，本站会尽量协助说明，但不承担超出商品说明范围的责任。
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200 rounded-2xl p-6 sm:p-8">
              <h2 className="text-base sm:text-lg font-bold text-purple-900 mb-3">
                6. 购买即视为同意
              </h2>
              <p className="text-sm sm:text-base text-purple-900 leading-relaxed">
                用户在本站下单购买，即视为已阅读并同意本站的商品说明、FAQ 与售后说明。请在下单前认真阅读。
              </p>
            </div>
          </div>

          <div className="mt-12 text-center text-xs text-gray-500">
            本声明内容如有调整，以本站最新版本为准。
          </div>
        </div>
      </section>
    </div>
  );
}
