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

export default function Editor5() {
  const [fields, setFields] = useState<Field[]>([]);
  const refs = useRef<Map<string, HTMLDivElement | null | undefined>>(
    new Map()
  );
  const [currentActiveField, setCurrentActiveField] = useState<string | null>(
    null
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

  const handleAddTextField = () => {
    const newField: Field = {
      type: 'text',
      content: '',
      id: uuidv4(),
    };

    setFields([...fields, newField]);
    setCurrentActiveField(newField.id); // Set the newly added field as the current active field
  };

  const handleAddCheckboxField = () => {
    const newField: Field = {
      type: 'checkbox',
      content: '',
      checked: false,
      id: uuidv4(),
    };

    setFields([...fields, newField]);
    setCurrentActiveField(newField.id); // Set the newly added field as the current active field
  };

  const handleTextChange = (id: string, content: string): void => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, content } : field
      )
    );
  };

  const handleCheckboxChange = (id: string, checked: boolean): void => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, checked } : field
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
    const el = fields.find((field) => field.id === id);
    console.log(el);
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTextField();
    }

    if (el && event.key === 'Backspace' && el.content === '') {
      event.preventDefault();
      refs.current.get(id)?.focus();
      handleDelTextField(id);
    }
  };

  return (
    <div>
      <div>
        <button onClick={handleAddTextField}>Add Text Field</button>
        <button onClick={handleAddCheckboxField}>Add Checkbox Field</button>
      </div>
      <div>
        {fields.map((field, index) => (
          <div key={field.id}>
            {field.type === 'text' && (
              <div
                ref={(el) => refs.current.set(field.id, el as HTMLDivElement)}
                contentEditable
                onFocus={() => setCurrentActiveField(field.id)} // Set the current active field when it receives focus
                onBlur={() => setCurrentActiveField(null)} // Clear the current active field when it loses focus
                onInput={(e) => {
                  handleTextChange(field.id, e.currentTarget.textContent || '');
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(e, field.id)
                }
                className={`${styles.textarea} ${
                  field.id === currentActiveField ? styles.active : ''
                }`}
              />
            )}
            {field.type === 'checkbox' && (
              <div className={styles.check_field}>
                <input
                  type="checkbox"
                  checked={field.checked}
                  onChange={(e) =>
                    handleCheckboxChange(field.id, e.target.checked)
                  }
                />
                <div
                  ref={(el) => refs.current.set(field.id, el as HTMLDivElement)}
                  contentEditable
                  onFocus={() => setCurrentActiveField(field.id)} // Set the current active field when it receives focus
                  onBlur={() => setCurrentActiveField(null)} // Clear the current active field when it loses focus
                  onInput={(e) => {
                    handleTextChange(
                      field.id,
                      e.currentTarget.textContent || ''
                    );
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    handleKeyDown(e, field.id)
                  }
                  className={`${styles.textarea} ${
                    field.id === currentActiveField ? styles.active : ''
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
