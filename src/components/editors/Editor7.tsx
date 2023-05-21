'use client';

import { v4 as uuidv4 } from 'uuid';
import {
  KeyboardEvent,
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './editor.module.css';

type FieldType = 'text' | 'checkbox';

interface Field {
  type: FieldType;
  content: string;
  checked?: boolean;
  id: string;
}

export default function Editor7() {
  const [fields, setFields] = useState<Field[]>([]);
  const refs = useRef<Map<string, HTMLDivElement | undefined>>(new Map());
  const [currentActiveField, setCurrentActiveField] = useState<string | null>(
    null
  );

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
    refs.current = new Map(
      fields.map((field) => [field.id, refs.current.get(field.id)] as const)
    );
  }, [fields]);

  useEffect(() => {
    if (fields.length === 0) {
      handleAddField('text');
    }
  }, []);

  const handleAddField = (type: FieldType, index = 0) => {
    const newField: Field = {
      type,
      content: '',
      id: uuidv4(),
    };

    const updatedFields = [...fields];
    updatedFields.splice(index, 0, newField);
    setFields(updatedFields);

    // Set the newly added field as the active field
    setCurrentActiveField(newField.id);
  };

  const handleTextInput = (id: string, content: string): void => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, content } : field
      )
    );
  };

  const handleTextEnter = (id: string) => {
    const fieldIndex = fields.findIndex((field) => field.id === id);
    handleAddField('text', fieldIndex + 1);
  };

  return (
    <div>
      <div>
        <button>Button</button>
      </div>
      <div className={styles.workspace}>
        <div>
          {fields.map((field, index) => (
            <div key={field.id}>
              {field.type === 'text' && (
                <Textbox
                  field={field}
                  refs={refs}
                  onInput={(content) => handleTextInput(field.id, content)}
                  onEnter={(id) => handleTextEnter(id)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ITextbox {
  field: Field;
  refs: MutableRefObject<Map<string, HTMLDivElement | undefined>>;
  onInput: (content: string) => void;
  onEnter: (id: string) => void;
}

function Textbox({ field, refs, onInput, onEnter }: ITextbox) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter(field.id);
    }
  };

  return (
    <div
      className={styles.textarea}
      contentEditable
      ref={(el) => refs.current.set(field.id, el as HTMLDivElement)}
      onInput={(e) => onInput(e.currentTarget.innerText)}
      onKeyDown={handleKeyDown}
    />
  );
}
