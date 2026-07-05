export interface Tool {
  slug: string;
  name: string;
  category: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
  keywords?: string[];
  faqs?: { question: string; answer: string }[];
  relatedTools?: string[];
  dialects?: { name: string; description: string }[];
}
