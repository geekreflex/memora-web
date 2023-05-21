import prisma from '@/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json({ todos });
}

export async function PUT(req: Request) {
  const res = await req.json();

  try {
    const todo = await prisma.todo.update({
      where: {
        id: parseInt(res.id),
      },
      data: {
        completed: res.completed,
      },
    });

    return NextResponse.json({ message: 'updated', todo });
  } catch (error) {
    return new NextResponse('Error');
  }
}
