import Link from "next/link";
import type { Product } from "@/data/products";
import { getPayUrl } from "@/data/products";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const payUrl = getPayUrl(product);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* 标签 */}
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

      {/* 名称与价格 */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        {product.price}
      </div>

      {/* 简介 */}
      <p className="text-gray-600 text-sm leading-relaxed mb-5">
        {product.description}
      </p>

      {/* 包含内容 */}
      <div className="mb-6 border-t border-gray-100 pt-5">
        <div className="text-xs font-semibold text-gray-500 mb-3">包含</div>
        <ul className="space-y-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center flex-shrink-0">
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* 按钮组 */}
      <div className="mt-auto flex flex-col sm:flex-row gap-3">
        <Link
          href={product.detailPath}
          className="flex-1 text-center px-5 py-3 rounded-xl text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          查看详情
        </Link>
        <a
          href={payUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-5 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
        >
          立即下单
        </a>
      </div>
    </div>
  );
}
