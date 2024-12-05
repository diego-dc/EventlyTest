import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize an instance of the Prisma Client for database operations.
const prisma = new PrismaClient();

// Handles GET requests to fetch a list of events.
export async function GET() {
  try {
    // Retrieve all events from the database, ordered by date of the event in ascending order.
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });

    // Respond with the list of events in JSON format
    return NextResponse.json(events);
  } catch (error) {
    // Respond with a 500 status code and an error message if an exception occurs.
    return NextResponse.json(
      { error: 'Error fetching events' },
      { status: 500 },
    );
  }
}

// Handles POST requests to create a new event.
export async function POST(req: Request) {
  try {
    // Parse the JSON body from the request.
    const body = await req.json();
    const { title, description, date, price, maxCapacity } = body;

    // Validate that all required fields are present in the request body.
    if (!title || !description || !date || !price || !maxCapacity) {
      // Respond with a 400 status code if any field is missing
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      );
    }

    // Check if an event with the same title already exists.
    const existingEvent = await prisma.event.findUnique({ where: { title } });

    // Respond with a 400 status code and an error message if the event already exists.
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

    // Create a new event in the database.
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        price: parseInt(price),
        maxcapacity: parseInt(maxCapacity),
      },
    });

    // Respond with a 500 status code and an error message if the event creation fails
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

    // Respond with a success response and the created event data in JSON format.
    return NextResponse.json({ success: true, newEvent });
  } catch (error) {
    // Handle any unexpected exceptions during the process.
    return NextResponse.json(
      { error: 'Error creating event ' + error },
      { status: 500 },
    );
  }
}
