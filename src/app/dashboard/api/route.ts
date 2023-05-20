import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    users: [
      { name: 'Jerry', age: 25 },
      { name: 'Josh', age: 25 },
    ],
  };
  return NextResponse.json(data);
}
