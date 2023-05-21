import prisma from '@/utils/prisma';

export default async function Page() {
  const todos = await prisma.todo.findMany();
  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
