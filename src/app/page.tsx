import { Search } from "lucide-react";

const popularTools = [
  "SQL Formatter",
  "JSON Formatter",
  "JWT Decoder",
  "UUID Generator",
  "Base64 Encoder",
  "Spark Memory Calculator",
];

const categories = [
  "AI",
  "Developer",
  "SQL",
  "JSON",
  "PDF",
  "Images",
  "Security",
  "Spark",
  "API",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-dark">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">VyomaStack</h1>
        <p className="text-lg text-slate-600">AI-Powered Developer Platform</p>

        <div className="mt-4 flex w-full max-w-xl items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search 500+ Developer Tools..."
            className="w-full outline-none placeholder:text-slate-400"
          />
        </div>
      </section>

      {/* Popular Tools */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Popular Tools</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {popularTools.map((tool) => (
            <div
              key={tool}
              className="rounded-lg border border-slate-200 p-4 text-center font-medium hover:border-primary hover:text-primary transition-colors"
            >
              {tool}
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-dark hover:bg-primary hover:text-white transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Latest Tools */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Latest Tools</h2>
        <p className="text-slate-500">Coming soon.</p>
      </section>

      {/* Latest Articles */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Latest Articles</h2>
        <p className="text-slate-500">Coming soon.</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} VyomaStack. The GitHub of Developer Tools.
      </footer>
    </main>
  );
}
