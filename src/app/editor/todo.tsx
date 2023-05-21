'use client';

import { Todo } from '@prisma/client';
import { useState } from 'react';

export default function TodoComponent({ todo }: { todo: Todo }) {
  const [todo_, setTodo] = useState(todo);
  const update = async (todo: Todo) => {
    const data = await fetch(`/api/todo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: !todo.completed,
        id: todo.id,
      }),
    });
    const res = await data.json();
    setTodo(res.todo);
  };

  return (
    <li key={todo_.id}>
      <input
        onChange={() => update(todo_)}
        type="checkbox"
        checked={todo_.completed}
      />
      {todo_.title}
    </li>
  );
}
