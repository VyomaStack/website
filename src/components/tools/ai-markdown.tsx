export function AiMarkdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === "code") {
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-lg border border-input bg-muted/50 p-3 font-mono text-xs leading-relaxed"
            >
              <code>{block.content}</code>
            </pre>
          );
        }
        if (block.type === "heading") {
          return (
            <h3 key={i} className="mt-4 text-base font-semibold first:mt-0">
              {block.content}
            </h3>
          );
        }
        if (block.type === "bullet") {
          return (
            <p key={i} className="ml-4 text-muted-foreground">
              • {block.content}
            </p>
          );
        }
        if (block.type === "blank") {
          return <br key={i} />;
        }
        return (
          <p key={i} className="text-muted-foreground">
            {block.content}
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { type: "code"; content: string }
  | { type: "heading"; content: string }
  | { type: "bullet"; content: string }
  | { type: "text"; content: string }
  | { type: "blank" };

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", content: codeLines.join("\n") });
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", content: line.replace("## ", "") });
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      blocks.push({ type: "bullet", content: line.slice(2) });
    } else if (line.trim() === "") {
      blocks.push({ type: "blank" });
    } else {
      blocks.push({ type: "text", content: line });
    }
    i++;
  }

  return blocks;
}
