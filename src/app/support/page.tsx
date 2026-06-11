export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-block text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-3 py-1 mb-5">
              Support
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              售后说明
            </h1>
            <p className="text-gray-600 text-base">
              请在下单前阅读以下售后规则，如遇到问题请按流程提交。
            </p>
          </div>

          {/* 虚拟商品说明 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-amber-900 mb-3">虚拟商品说明</h2>
            <p className="text-sm sm:text-base text-amber-900 leading-relaxed">
              本站商品属于虚拟服务 / 数字商品，下单前请仔细阅读商品详情，包含商品内容、使用场景、使用规则等说明。
            </p>
          </div>

          {/* 可处理情况 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">可处理情况</h2>
            <ul className="space-y-4 text-sm sm:text-base text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  ✓
                </span>
                <div>
                  <div className="font-medium text-gray-900 mb-1">发货链接打不开</div>
                  <div className="text-sm text-gray-600">提供订单号和相关截图，协助确认。</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  ✓
                </span>
                <div>
                  <div className="font-medium text-gray-900 mb-1">订单信息异常</div>
                  <div className="text-sm text-gray-600">核对订单详情，确认商品匹配。</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  ✓
                </span>
                <div>
                  <div className="font-medium text-gray-900 mb-1">商品说明与页面不一致</div>
                  <div className="text-sm text-gray-600">如收到的商品说明与描述存在明显差异，请提供截图。</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  ✓
                </span>
                <div>
                  <div className="font-medium text-gray-900 mb-1">需要补发发货信息</div>
                  <div className="text-sm text-gray-600">提供订单号，可协助补发。</div>
                </div>
              </li>
            </ul>
          </div>

          {/* 不承诺情况 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">不承诺情况</h2>
            <ul className="space-y-4 text-sm sm:text-base text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center flex-shrink-0">
                  ✕
                </span>
                <div>
                  <div className="font-medium text-gray-900 mb-1">不承诺第三方平台永久可用</div>
                  <div className="text-sm text-gray-600">
                    第三方平台（如 GPT、Gemini 等）的可用性和规则由平台本身决定。
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center flex-shrink-0">
                  ✕
                </span>
                <div>
                  <div className="font-medium text-gray-900 mb-1">不承诺第三方平台规则不变化</div>
                  <div className="text-sm text-gray-600">
                    平台功能、价格、使用规则可能调整，以官方最新为准。
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center flex-shrink-0">
                  ✕
                </span>
                <div>
                  <div className="font-medium text-gray-900 mb-1">不承诺所有用户环境都完全一致</div>
                  <div className="text-sm text-gray-600">
                    用户的设备、网络、地区不同，使用体验可能存在差异。
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center flex-shrink-0">
                  ✕
                </span>
                <div>
                  <div className="font-medium text-gray-900 mb-1">不处理违反第三方平台规则的需求</div>
                  <div className="text-sm text-gray-600">
                    用户应遵守相关第三方平台的服务条款。
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* 用户提交售后需要提供 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-purple-900 mb-4">
              用户提交售后时需要提供
            </h2>
            <ul className="space-y-3 text-sm sm:text-base text-purple-900">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  1
                </span>
                订单号
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  2
                </span>
                购买商品
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  3
                </span>
                问题截图
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-purple-200 text-purple-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  4
                </span>
                具体问题描述
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
