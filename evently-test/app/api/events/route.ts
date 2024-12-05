import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { error } from 'console';
import { stat } from 'fs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Error fetching events' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, description, date, price, maxCapacity } = body;

    console.log('Request Body:', body);

    if (!title || !description || !date || !price || !maxCapacity) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      );
    }

    const existingEvent = await prisma.event.findUnique({ where: { title } });

    if (existingEvent) {
      console.error('Event already exists');
      return NextResponse.json(
        {
          error: 'Event already exists',
          message: 'Event already exists',
        },
        { status: 400 },
      );
    }

    console.log('Creating event');

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        price: parseInt(price),
        maxcapacity: parseInt(maxCapacity),
      },
    });

    if (!newEvent) {
      console.error('Error creating event');
      return NextResponse.json(
        {
          error: 'Error creating event',
          message: 'An error occurred while creating the event',
        },
        { status: 500 },
      );
    }

    return NextResponse.json(newEvent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating event ' + error },
      { status: 500 },
    );
  }
}
