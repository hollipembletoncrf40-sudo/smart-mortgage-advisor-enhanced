import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (currentList.length > 0) {
        const ListTag = listType === 'ol' ? 'ol' : 'ul';
        elements.push(
          <ListTag key={`list-${elements.length}`} className={listType === 'ol' ? 'list-decimal list-inside space-y-1 my-2' : 'list-none space-y-1 my-2'}>
            {currentList.map((item, i) => (
              <li key={i} className="text-slate-700 dark:text-slate-300">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ListTag>
        );
        currentList = [];
        listType = null;
      }
    };

    const renderInlineMarkdown = (line: string): React.ReactNode => {
      // Handle bold text **text**
      let parts: React.ReactNode[] = [];
      let lastIndex = 0;
      const boldRegex = /\*\*(.+?)\*\*/g;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-slate-800 dark:text-white">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return parts.length > 0 ? parts : line;
    };

    lines.forEach((line, index) => {
      // Empty line
      if (line.trim() === '') {
        flushList();
        return;
      }

      // Headers
      if (line.startsWith('**') && line.endsWith('**')) {
        flushList();
        const text = line.slice(2, -2);
        elements.push(
          <h4 key={`h-${index}`} className="font-bold text-slate-800 dark:text-white mt-4 mb-2 text-base">
            {text}
          </h4>
        );
        return;
      }

      // Numbered list
      const numberedMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*:\s*(.+)$/);
      if (numberedMatch) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(`${numberedMatch[2]}: ${numberedMatch[3]}`);
        return;
      }

      // Bullet list with checkmark
      if (line.match(/^[✓✅]/)) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(line);
        return;
      }

      // Bullet list with dash
      if (line.startsWith('- ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(line.substring(2));
        return;
      }

      // Warning/Note lines
      if (line.startsWith('⚠️') || line.startsWith('❌') || line.startsWith('✅')) {
        flushList();
        elements.push(
          <div key={`note-${index}`} className="flex items-start gap-2 my-2 text-sm">
            <span className="flex-shrink-0">{line[0]}</span>
            <span className="text-slate-700 dark:text-slate-300">{renderInlineMarkdown(line.substring(2).trim())}</span>
          </div>
        );
        return;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={`p-${index}`} className="text-slate-700 dark:text-slate-300 my-2 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });

    flushList();
    return elements;
  };

  return (
    <div className={`markdown-content ${className}`}>
      {renderContent(content)}
    </div>
  );
};

export default MarkdownRenderer;
