import prisma from '@/utils/prisma';
import Todo from './todo';

export default async function Page() {
  const todos = await prisma.todo.findMany();
  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <Todo todo={todo} />
        ))}
      </ul>
    </div>
  );
}
