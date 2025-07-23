import React, { useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Link, 
  Image, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Code2, 
  Heading1, 
  Heading2, 
  Heading3,
  Eye,
  EyeOff,
  Copy,
  Download,
  Upload,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';

import { convertMarkdownToHTML } from '../../utils/MarkdownToHtml';

const defaultMarkdown= `# This is a sample markdown content

This is a **powerful** markdown editor with live preview functionality.

## Features

- Real-time preview with improved parsing
- Syntax highlighting toolbar
- Full markdown support
- Copy and download functionality
- Responsive design
- Fixed code block rendering

### Code Examples

Here's some inline code: \`for(int i=0;i<n;i++)\` and \`console.log("Hello")\`

#### C Code Block
\`\`\`c
for(int i=0; i<n; i++) {
    printf("Index: %d\\n", i);
}
\`\`\`

#### JavaScript Code Block
\`\`\`javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}
\`\`\`

#### Python Code Block
\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    return quicksort([x for x in arr if x < pivot]) + [pivot] + quicksort([x for x in arr if x > pivot])
\`\`\`

### Lists

#### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item

#### Ordered List
1. First item
2. Second item
3. Third item

### Links and Images

[Visit Google](https://google.com)

> This is a blockquote
> 
> It can span multiple lines and contains code: \`example()\`

### Table

| Language | Extension | Example |
|----------|-----------|---------|
| C        | .c        | \`printf("Hello");\` |
| Python   | .py       | \`print("Hello")\` |
| JS       | .js       | \`console.log("Hello")\` |

---

**Bold text** and *italic text* and ~~strikethrough~~

Mixed formatting: **bold with \`code\`** and *italic with \`inline code\`*
`

const MarkdownEditor = ({ title = '' ,onContentChange }) => {
  
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  const setDefaultMarkdown = () => {
    setMarkdown(defaultMarkdown);
  };

  const handleChange = (e) => {
    setMarkdown(e.target.value);
    onContentChange(e.target.value);
  };

  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Enhanced markdown to HTML converter with better code handling

  useEffect(() => {
   const fetchPreview = async () => {
     const html = await convertMarkdownToHTML(markdown);
     document.getElementById('markdown-preview').innerHTML = html;
   };
   fetchPreview();
  }, [markdown]);

  const insertText = (before, after = '') => {
    const textarea = document.getElementById('markdown-input');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    
    const newText = markdown.substring(0, start) + 
                   before + selectedText + after + 
                   markdown.substring(end);
    
    setMarkdown(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
    }, 0);
  };

  const toolbarButtons = [
    { icon: Heading1, action: () => insertText('# '), title: 'Heading 1' },
    { icon: Heading2, action: () => insertText('## '), title: 'Heading 2' },
    { icon: Heading3, action: () => insertText('### '), title: 'Heading 3' },
    { icon: Bold, action: () => insertText('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Italic' },
    { icon: Strikethrough, action: () => insertText('~~', '~~'), title: 'Strikethrough' },
    { icon: Link, action: () => insertText('[', '](url)'), title: 'Link' },
    { icon: Image, action: () => insertText('![alt](', ')'), title: 'Image' },
    { icon: Code, action: () => insertText('`', '`'), title: 'Inline Code' },
    { icon: Code2, action: () => insertText('```\n', '\n```'), title: 'Code Block' },
    { icon: List, action: () => insertText('- '), title: 'Unordered List' },
    { icon: ListOrdered, action: () => insertText('1. '), title: 'Ordered List' },
    { icon: Quote, action: () => insertText('> '), title: 'Blockquote' },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearEditor = () => {
    setMarkdown('');
  };

  // Add global copy function for code blocks
  useEffect(() => {
    window.copyCode = (button) => {
      const codeBlock = button.closest('.code-block-container').querySelector('code');
      navigator.clipboard.writeText(codeBlock.textContent);
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    };
  }, []);

  return (
    <div className={`bg-white rounded-lg h-full shadow-2xl border border-gray-200 ${isFullscreen ? 'fixed inset-0 z-50' : 'max-w-7xl mx-auto'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{title.length > 0 ? title : 'Question Title'}</h1>
          <div className="flex items-center space-x-2">
            {/* <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-1 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="text-sm">{showPreview ? 'Hide' : 'Show'}</span>
            </button> */}
            <button
              onClick={() => {
                setIsFullscreen(!isFullscreen);
               window.scrollTo(0, 0);
              }}
              className="flex items-center space-x-1 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="flex flex-wrap items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title={button.title}
            >
              <button.icon size={18} className="text-gray-600" />
            </button>
          ))}
          
          <div className="h-6 w-px bg-gray-300 mx-2" />
          
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            title="Copy Markdown"
          >
            <Copy size={16} />
            <span className="text-sm">Copy</span>
          </button>
          
          <button
            onClick={downloadMarkdown}
            className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            title="Download Markdown"
          >
            <Download size={16} />
            <span className="text-sm">Download</span>
          </button>

          <button
            onClick={setDefaultMarkdown}
            className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
            title="Reset to Default Markdown"
          >
            <Upload size={16} />
            <span className="text-sm">Reset</span>
          </button>
          
          <button
            onClick={clearEditor}
            className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            title="Clear Editor"
          >
            <RotateCcw size={16} />
            <span className="text-sm">Clear</span>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex" style={{ height: isFullscreen ? 'calc(100vh + 20vh)' : 'calc(100vh - 128px)' }}>
        {/* Editor Pane */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} border-r border-gray-200`}>
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Markdown Input</h3>
          </div>
          <textarea
            id="markdown-input"
            value={markdown}
            onChange={handleChange}
            className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none bg-white"
            placeholder="Type your markdown here..."
            style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
          />
        </div>

        {/* Preview Pane */}
        {showPreview && (
          <div className="w-1/2">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
            </div>
            <div 
              className="h-full p-4 overflow-y-auto bg-white prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(markdown) }}
            />
          </div>
        )}
      </div>

      {/* Footer */}
  
    </div>
  );
};

export default MarkdownEditor;