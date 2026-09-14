import { ProductInformation } from 'src/model/product/product.validation';

export function productInformationBuilder(
  description: string,
  whyChoose: string,
  information: ProductInformation,
): string {
  return `
${description}

🍦 Highlights
${information.highlights.map((item) => `• ${item}`).join('\n')}

🍨 Serving Suggestions
${information.servingSuggestions.map((item) => `• ${item}`).join('\n')}

📦 Product Details
• Size: ${information.productDetails.size}
• Storage: ${information.productDetails.storage}
• Shelf life: ${information.productDetails.shelfLife}

⚡ Why Choose This Product?
${whyChoose}
`.trim();
}
