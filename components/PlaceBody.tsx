'use client';

interface PlaceBodyProps {
  content: string;
}

export default function PlaceBody({ content }: PlaceBodyProps) {
  if (!content) return null;

  // Split by double newlines for paragraphs
  const blocks = content.split(/\n\n+/);

  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 2: ## Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={index}
              className="font-display text-2xl text-foreground mt-12 mb-6 first:mt-0"
            >
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        // Heading 3: ### Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={index}
              className="font-display text-xl text-foreground mt-10 mb-4"
            >
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        // Blockquote: > Quote
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={index}
              className="border-l-2 border-olive pl-6 my-8 text-foreground/80 italic"
            >
              {trimmed.replace('> ', '')}
            </blockquote>
          );
        }

        // Regular paragraph
        return (
          <p
            key={index}
            className="text-foreground/80 leading-relaxed mb-6"
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
