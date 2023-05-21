'use client';
import React, { createRef, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './editor.module.css';

type FieldType = 'text' | 'checkbox';

interface Field {
  type: FieldType;
  content: string;
  checked?: boolean;
  id: string;
}

export default function Editor4() {
  const [fields, setFields] = useState<Field[]>([]);
  const [currentActiveField, setCurrentActiveField] = useState<string | null>(
    null
  );
  const refs = useRef<Map<string, HTMLDivElement | null | undefined>>(
    new Map()
  );

  useEffect(() => {
    refs.current = new Map(
      fields.map((field) => [field.id, refs.current.get(field.id)] as const)
    );
  }, [fields]);

  useEffect(() => {
    if (currentActiveField) {
      const ref = refs.current.get(currentActiveField);
      if (ref) {
        ref.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(ref);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [currentActiveField]);

  useEffect(() => {
    if (fields.length > 0) {
      const lastField = fields[fields.length - 1];
      const ref = refs.current.get(lastField.id);
      if (ref) {
        ref.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(ref);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [fields, currentActiveField]);

  const handleAddTextField = () => {
    const newField: Field = {
      type: 'text',
      content: '',
      id: uuidv4(),
    };

    setFields([...fields, newField]);
  };

  const handleTextChange = (id: string, content: string): void => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, content } : field
      )
    );
  };

  const changeToCheckBox = () => {
    const oldContent = fields.find((field) => field.id === currentActiveField);
    const update = {
      ...oldContent,
      checked: false,
      type: 'checkbox',
    };
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === oldContent?.id ? { ...field, update } : field
      )
    );
  };

  const handleDelTextField = (id: string) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: string
  ) => {
    const el = fields.find((field) => field.id == id);
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTextField();
    }

    if (el && event.key === 'Backspace' && el.content == '') {
      event.preventDefault();
      refs.current.get(id)?.focus();
      handleDelTextField(id);
    }
  };

  return (
    <div>
      <div>
        <button onClick={handleAddTextField}>Add Text Field</button>
        <button onClick={changeToCheckBox}>Text to checkbox</button>
      </div>
      <div>
        {fields.map((field, index) => (
          <div key={index}>
            {field.type === 'text' && (
              <div key={field.id}>
                <div
                  ref={(el) => refs.current.set(field.id, el as HTMLDivElement)}
                  contentEditable
                  onFocus={() => setCurrentActiveField(field.id)}
                  onBlur={() => setCurrentActiveField(field.id)}
                  onInput={(e) => {
                    handleTextChange(
                      field.id,
                      e.currentTarget.textContent || ''
                    );
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    handleKeyDown(e, field.id)
                  }
                  className={styles.textarea}
                />
              </div>
            )}
            {field.type === 'checkbox' && (
              <div>
                <input type="checkbox" checked={field.checked} />
                <div
                  ref={(el) => refs.current.set(field.id, el as HTMLDivElement)}
                  contentEditable
                  onFocus={() => setCurrentActiveField(field.id)}
                  onInput={(e) => {
                    handleTextChange(
                      field.id,
                      e.currentTarget.textContent || ''
                    );
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    handleKeyDown(e, field.id)
                  }
                  className={styles.textarea}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
