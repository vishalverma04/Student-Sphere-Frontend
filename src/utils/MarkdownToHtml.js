export const convertMarkdownToHTML = (md) => {
    let html = md;
    
    // Escape HTML entities first
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Code blocks (must be processed before inline code)
    html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text';
      const trimmedCode = code.trim();
      // Preserve line breaks in code blocks by replacing them with a placeholder
      const codeWithBreaks = trimmedCode.replace(/\n/g, '###LINEBREAK###');
      return `<div class="code-block-container my-4">
        <div class="code-header bg-gray-800 text-gray-300 px-4 py-2 text-xs font-mono rounded-t-lg flex justify-between items-center">
          <span>${language}</span>
          <button onclick="copyCode(this)" class="text-gray-400 hover:text-white transition-colors">Copy</button>
        </div>
        <pre class="bg-gray-900 text-green-400 p-4 rounded-b-lg overflow-x-auto m-0 whitespace-pre"><code class="language-${language}">${codeWithBreaks}</code></pre>
      </div>`;
    });
    
    // Inline code (after code blocks to avoid conflicts)
    html = html.replace(/`([^`\n]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600 border">$1</code>');
    
    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-800 border-b border-gray-200 pb-1">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-6 text-gray-900 border-b-2 border-blue-200 pb-3">$1</h1>');
    
    // Bold (improved to avoid conflicts with other formatting)
    html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    
    // Italic
    html = html.replace(/\*([^*\n]+)\*/g, '<em class="italic text-gray-800">$1</em>');
    
    // Strikethrough
    html = html.replace(/~~([^~\n]+)~~/g, '<del class="line-through text-gray-600">$1</del>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-all" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, 
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 border border-gray-200 shadow-sm" />');
    
    // Blockquotes (improved to handle multi-line)
    html = html.replace(/^> (.*$)/gm, '<div class="blockquote-line">$1</div>');
    html = html.replace(/(<div class="blockquote-line">.*<\/div>(\n<div class="blockquote-line">.*<\/div>)*)/gs, 
      '<blockquote class="border-l-4 border-blue-400 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700 rounded-r">$1</blockquote>');
    html = html.replace(/<div class="blockquote-line">(.*)<\/div>/g, '<p class="mb-1 last:mb-0">$1</p>');
    
    // Lists (improved handling)
    // Unordered lists
    html = html.replace(/^(\s*)[-*+] (.*)$/gm, (match, indent, content) => {
      const level = Math.floor(indent.length / 2);
      return `<li class="list-item-${level} ml-${level * 4} mb-1">${content}</li>`;
    });
    html = html.replace(/(<li class="list-item-\d+[^"]*">.*<\/li>(\n<li class="list-item-\d+[^"]*">.*<\/li>)*)/gs, 
      '<ul class="list-disc list-inside my-3 space-y-1 pl-4">$1</ul>');
    
    // Ordered lists
    html = html.replace(/^(\s*)\d+\. (.*)$/gm, (match, indent, content) => {
      const level = Math.floor(indent.length / 2);
      return `<li class="ordered-item-${level} ml-${level * 4} mb-1">${content}</li>`;
    });
    html = html.replace(/(<li class="ordered-item-\d+[^"]*">.*<\/li>(\n<li class="ordered-item-\d+[^"]*">.*<\/li>)*)/gs, 
      '<ol class="list-decimal list-inside my-3 space-y-1 pl-4">$1</ol>');
    
    // Tables (enhanced)
    const tableRows = [];
    const lines = html.split('\n');
    let inTable = false;
    let processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('|') && !line.startsWith('<')) {
        if (!inTable) {
          inTable = true;
          tableRows.length = 0;
        }
        
        const cells = line.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
        
        // Skip separator rows
        if (!cells.every(cell => /^[-:|\s]*$/.test(cell))) {
          const isHeader = tableRows.length === 0;
          const cellTag = isHeader ? 'th' : 'td';
          const cellClass = isHeader ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700';
          
          const cellsHtml = cells.map(cell => 
            `<${cellTag} class="border border-gray-300 px-3 py-2 ${cellClass}">${cell}</${cellTag}>`
          ).join('');
          
          tableRows.push(`<tr>${cellsHtml}</tr>`);
        }
      } else {
        if (inTable && tableRows.length > 0) {
          processedLines.push(`<table class="border-collapse border border-gray-300 my-4 w-full rounded-lg overflow-hidden shadow-sm">${tableRows.join('')}</table>`);
          tableRows.length = 0;
          inTable = false;
        }
        processedLines.push(line);
      }
    }
    
    // Handle table at end of content
    if (inTable && tableRows.length > 0) {
      processedLines.push(`<table class="border-collapse border border-gray-300 my-4 w-full rounded-lg overflow-hidden shadow-sm">${tableRows.join('')}</table>`);
    }
    
    html = processedLines.join('\n');
    
    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr class="border-t-2 border-gray-300 my-8" />');
    
    // Paragraphs (improved to avoid breaking other elements)
    html = html.replace(/^(?!<[^>]+>|$)([^\n<].*)$/gm, '<p class="my-2 leading-relaxed">$1</p>');
    
    // Clean up extra line breaks and spacing, but preserve code block formatting
    html = html.replace(/\n+/g, '\n');
    html = html.replace(/\n/g, ' ');
    
    // Restore line breaks in code blocks
    html = html.replace(/###LINEBREAK###/g, '\n');
    
    return html;
};

