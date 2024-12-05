import { authOptions } from '@/lib/authOptions';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// Instantiate the Prisma Client to manage database queries.
const prisma = new PrismaClient();

// Handles GET requests to retrieve all transactions.
export async function GET() {
  try {
    // Fetch all transactions from the database, ordered by their IDs in ascending order.
    const transactions = await prisma.transaction.findMany({
      orderBy: { id: 'asc' },
    });

    // Respond with the retrieved transactions in JSON format.
    return NextResponse.json(transactions);
  } catch (error) {
    // Respond with a 500 status code and an error message.
    return NextResponse.json(
      { error: 'Error fetching events' },
      { status: 500 },
    );
  }
}

// Handles POST requests to create a new transaction.
export async function POST(req: Request) {
  // Retrieve the server-side session using NextAuth.
  const session = await getServerSession(authOptions);
  // Extract the user's email from the session. Default to an empty string if the session or email is unavailable.
  const user_email = session?.user?.email || '';

  try {
    // Parse the JSON body from the request.
    // Destructure the required properties from the request body.
    const body = await req.json();
    const { name, last_name, email, amount, tickets, event_id } = body;

    // Fetch the associated event by its ID.
    const event = await prisma.event.findUnique({
      where: { id: parseInt(event_id) },
    });

    // Handle the case where the event does not exist in the database.
    if (!event) {
      return NextResponse.json(
        { error: 'Error', message: 'Event not found.' },
        { status: 404 },
      );
    }

    // Retrieve all transactions for the event to calculate current capacity.
    const transactions = await prisma.transaction.findMany({
      where: { eventId: event_id },
    });

    // Calculate the total tickets already purchased for the event.
    const totalTickets = transactions.reduce(
      (sum: number, t: { tickets: number }) => sum + t.tickets,
      0,
    );

    // Check if adding the requested tickets exceeds the event's maximum capacity.
    // We could also check in the client side but it's a simple implementation for now.
    if (totalTickets + tickets > event.maxcapacity) {
      return NextResponse.json(
        {
          erorr: 'Error',
          message: "Event's Max. Capacity Reached. Cannot add more tickets.",
        },
        { status: 400 },
      );
    }

    // Fetch the user by their email.
    const user = await prisma.user.findUnique({
      where: { email: user_email },
    });

    // Handle the case where the user is not found.
    if (!user) {
      return NextResponse.json(
        { error: 'Error', message: 'User not found.' },
        { status: 404 },
      );
    }

    // Create a new transaction for the event.
    const transaction = await prisma.transaction.create({
      data: {
        eventId: event_id,
        userId: user.id,
        tickets: tickets,
        firstName: name,
        lastName: last_name,
        email: email,
        amount: amount,
      },
    });

    // Respond with the created transaction in JSON format.
    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    // Respond with a 500 status code and an error message.
    return NextResponse.json(
      { error: 'Error', message: 'Error processing transaction.' },
      { status: 500 },
    );
  }
}
