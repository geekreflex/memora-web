'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { v4 as uuidv4 } from 'uuid';

type FieldType = 'text' | 'checkbox';

interface Field {
  id: string;
  type: FieldType;
  content: string;
  checked?: boolean;
}

export default function Editor2() {
  const [fields, setFields] = useState<Field[]>([]);

  const handleAddText = (): void => {
    const newField: Field = {
      type: 'text',
      content: '',
      id: uuidv4(),
    };
    setFields([...fields, newField]);
  };

  const handleAddCheckbox = () => {
    const newField: Field = {
      type: 'checkbox',
      content: '',
      id: uuidv4(),
      checked: false,
    };
    setFields([...fields, newField]);
  };

  useEffect(() => {
    console.log(fields);
  }, [fields]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ): void => {
    const { name, value, type } = event.target;

    console.log(name, type, value);

    setFields((prevFields) =>
      prevFields.map((field) => {
        if (field.id === id) {
          if (type === 'checkbox') {
            return {
              ...field,
              [name]: (event.target as HTMLInputElement).checked,
            };
          } else {
            return {
              ...field,
              [name]: value,
            };
          }
        }
        return field;
      })
    );
  };

  return (
    <div>
      <div className={styles.actions}>
        <button onClick={handleAddText}>Text</button>
        <button onClick={handleAddCheckbox}>Radio</button>
      </div>
      <div className={styles.textfield}>
        {fields.map((field) => (
          <div key={field.id}>
            {field.type === 'checkbox' && (
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={field.checked}
                  name="checked"
                  onChange={(e) => handleInputChange(e, field.id)}
                />
                <textarea
                  className={styles.textarea}
                  value={field.content}
                  name="content"
                  onChange={(e) => handleInputChange(e, field.id)}
                />
              </div>
            )}
            {field.type === 'text' && (
              <textarea
                className={styles.textarea}
                value={field.content}
                name="content"
                onChange={(e) => handleInputChange(e, field.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
