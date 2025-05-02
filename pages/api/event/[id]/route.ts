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

// GET single event
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    return handleError(error);
  }
}

// PUT update event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(params.id) },
      data: {
        name: body.name,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
        location: body.location,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return handleError(error);
  }
}

// DELETE event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.event.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}