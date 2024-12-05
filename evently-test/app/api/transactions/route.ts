import { authOptions } from '@/lib/authOptions';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { id: 'asc' },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Error fetching events' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user_email = session?.user?.email || '';

  try {
    const body = await req.json();
    const { name, last_name, email, amount, tickets, event_id } = body;
    console.log('Request Body:', body);

    // Obtener evento desde la base de datos
    const event = await prisma.event.findUnique({
      where: { id: parseInt(event_id) },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Error', message: 'Event not found.' },
        { status: 404 },
      );
    }

    console.log('Event:', event);

    const transactions = await prisma.transaction.findMany({
      where: { eventId: event_id },
    });

    // Calcular la capacidad ocupada
    const totalTickets = transactions.reduce(
      (sum: number, t: { tickets: number }) => sum + t.tickets,
      0,
    );
    console.log(totalTickets);
    console.log(tickets);

    if (totalTickets + tickets > event.maxcapacity) {
      return NextResponse.json(
        {
          erorr: 'Error',
          message: 'Not enough capacity available.',
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: user_email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Error', message: 'User not found.' },
        { status: 404 },
      );
    }

    // Crear la transacción
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

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error', message: 'Error processing transaction.' },
      { status: 500 },
    );
  }
}
