import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';

const prisma = new PrismaClient();

// Helper function to handle errors
function handleError(error: any) {
  console.error(error);
  return NextResponse.json(
    { error: error.message || 'Something went wrong' },
    { status: 500 }
  );
}

// GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany();
    return NextResponse.json(events);
  } catch (error) {
    return handleError(error);
  }
}

// POST create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.date || !body.location || body.price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        name: body.name,
        description: body.description || null,
        date: new Date(body.date),
        location: body.location,
        price: parseFloat(body.price),
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}