export interface Tool {
  slug: string;
  name: string;
  category: string;
  description: string;
  faqs?: { question: string; answer: string }[];
  relatedTools?: string[];
}
