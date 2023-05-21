'use client';

import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import styles from './editor.module.css';

type FieldType = 'text' | 'checkbox';

interface Field {
  type: FieldType;
  content: string;
  checked?: boolean;
  id: string;
  ref: React.RefObject<HTMLInputElement | HTMLDivElement>;
}

interface TextInputProps {
  content: string;
  onBlur: (content: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
}

interface CheckboxInputProps {
  checked: boolean;
  onCheck: (checked: boolean) => void;
  content: string;
  onContentBlur: (content: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
}

function TextInput({
  content,
  onBlur,
  onEnter,
  onBackspace,
}: TextInputProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onEnter();
    } else if (event.key === 'Backspace' && content === '') {
      event.preventDefault();
      onBackspace();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus on the content editable field after the component renders
    }
  }, []);

  return (
    <div
      ref={inputRef}
      contentEditable
      onBlur={(e) => onBlur(e.target.innerHTML)}
      onKeyDown={handleKeyDown}
      className={styles.textarea}
      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
    />
  );
}

function CheckboxInput({
  checked,
  onCheck,
  content,
  onContentBlur,
  onEnter,
  onBackspace,
}: CheckboxInputProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    onCheck(event.target.checked);
  };

  const handleContentBlur = (
    event: React.ChangeEvent<HTMLDivElement>
  ): void => {
    onContentBlur(event.target.innerHTML);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onEnter();
    } else if (event.key === 'Backspace' && content === '') {
      event.preventDefault();
      onBackspace();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus on the content editable field after the component renders
    }
  }, []);

  return (
    <div className={styles.check_field}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <div
        contentEditable
        ref={inputRef}
        onBlur={handleContentBlur}
        className={styles.textarea}
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function App(): JSX.Element {
  const [fields, setFields] = useState<Field[]>([]);

  const handleAddText = (index: number): void => {
    const newField: Field = {
      type: 'text',
      content: '',
      id: uuidv4(),
      ref: React.createRef<HTMLDivElement | HTMLInputElement>(),
    };

    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields.splice(index + 1, 0, newField);
      return newFields;
    });
  };

  const handleAddCheckbox = (index: number): void => {
    const newField: Field = {
      type: 'checkbox',
      content: '',
      checked: false,
      id: uuidv4(),
      ref: React.createRef<HTMLDivElement | HTMLInputElement>(),
    };

    setFields((prevFields) => {
      const newFields = [...prevFields];
      newFields.splice(index + 1, 0, newField);
      return newFields;
    });
  };

  const handleTextBlur = (id: string, content: string): void => {
    console.log(content);
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, content } : field
      )
    );
  };

  const handleCheckboxCheck = (id: string, checked: boolean): void => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, checked } : field
      )
    );
  };

  const handleCheckboxContentBlur = (id: string, content: string): void => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, content } : field
      )
    );
  };

  const handleTextEnter = (index: number): void => {
    handleAddText(index);
  };

  const handleCheckboxEnter = (index: number): void => {
    handleAddCheckbox(index);
  };

  const handleTextBackspace = (id: string): void => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  const handleCheckboxBackspace = (id: string): void => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  return (
    <div>
      <button onClick={() => handleAddText(-1)}>Add Text Field</button>
      <button onClick={() => handleAddCheckbox(-1)}>Add Checkbox Field</button>

      {fields.map((field, index) => (
        <div key={field.id}>
          {field.type === 'text' && (
            <TextInput
              content={field.content}
              onBlur={(content) => handleTextBlur(field.id, content)}
              onEnter={() => handleTextEnter(index)}
              onBackspace={() => handleTextBackspace(field.id)}
            />
          )}
          {field.type === 'checkbox' && (
            <CheckboxInput
              checked={field.checked || false}
              onCheck={(checked) => handleCheckboxCheck(field.id, checked)}
              content={field.content}
              onContentBlur={(content) =>
                handleCheckboxContentBlur(field.id, content)
              }
              onEnter={() => handleCheckboxEnter(index)}
              onBackspace={() => handleCheckboxBackspace(field.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
