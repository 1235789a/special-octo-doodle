import { paymentLinks } from "@/config/payments";

export type Product = {
  id: string;
  name: string;
  price: string;
  period: string;
  tags: string[];
  description: string;
  features: string[];
  detailPath: string;
  payUrlKey: "gptPlus" | "gemini";
};

export const products: Product[] = [
  {
    id: "gpt-plus-month",
    name: "GPT Plus 一个月",
    price: "¥99",
    period: "一个月",
    tags: ["热门", "一个月", "GPT"],
    description:
      "适合想体验 GPT Plus、使用更强模型和高级功能的用户。",
    features: [
      "GPT Plus 一个月服务说明",
      "使用前注意事项",
      "常见问题说明",
      "下单后发货指引",
    ],
    detailPath: "/products/gpt-plus-month",
    payUrlKey: "gptPlus",
  },
  {
    id: "gemini-year",
    name: "Gemini 一年",
    price: "¥299",
    period: "一年",
    tags: ["长期", "一年", "Gemini"],
    description:
      "适合想长期使用 Gemini / Google AI 能力的用户。",
    features: [
      "Gemini 一年服务说明",
      "使用场景说明",
      "常见问题说明",
      "下单后发货指引",
    ],
    detailPath: "/products/gemini-year",
    payUrlKey: "gemini",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getPayUrl(product: Product): string {
  return paymentLinks[product.payUrlKey];
}
