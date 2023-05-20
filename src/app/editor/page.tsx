'use client';

import React, { useState, useRef } from 'react';

const RichEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const formatText = (command: string) => {
    if (!textAreaRef.current) return;

    const textarea = textAreaRef.current;
    const { selectionStart, selectionEnd } = textarea;
    const selectedText = textarea.value.substring(selectionStart, selectionEnd);
    const formattedText = `<${command}>${selectedText}</${command}>`;

    const updatedContent =
      textarea.value.substring(0, selectionStart) +
      formattedText +
      textarea.value.substring(selectionEnd);

    setContent(updatedContent);

    // Place the cursor at the end of the formatted text
    setTimeout(() => {
      textarea.selectionStart = selectionStart + formattedText.length;
      textarea.selectionEnd = selectionStart + formattedText.length;
    }, 0);

    textarea.focus();
  };

  return (
    <div>
      <h1>Rich Editor</h1>
      <div>
        <button onClick={() => formatText('b')}>Bold</button>
        <button onClick={() => formatText('i')}>Italic</button>
      </div>
      <textarea
        ref={textAreaRef}
        value={content}
        onChange={handleInputChange}
      />
      <div>
        <h2>Preview:</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default RichEditor;
