import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { UserService } from '@/services/user.service';

// GET: Load prompt for current user
export async function GET(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await UserService.getByClerkId(clerkUser.id);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const prompt = await prisma.prompt.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ prompt: prompt?.prompt || '' });
}

// POST: Save prompt for current user
export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await UserService.getByClerkId(clerkUser.id);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { prompt } = await req.json();
  if (typeof prompt !== 'string') return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
  const saved = await prisma.prompt.upsert({
    where: { userId: user.id },
    update: { prompt },
    create: { userId: user.id, prompt },
  });
  return NextResponse.json({ prompt: saved.prompt });
}
