import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, last_name, email, tickets, event_id } = body;
    console.log('Request Body:', body);

    // Obtener evento desde la base de datos
    const event = await prisma.event.findUnique({
      where: { id: parseInt(event_id) },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found.' },
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
      return NextResponse.json({
        success: false,
        message: 'Not enough capacity available.',
      });
    }

    const userId = 1;

    // Crear la transacción
    const transaction = await prisma.transaction.create({
      data: {
        eventId: event_id,
        userId: userId,
        tickets: tickets,
        firstName: name,
        lastName: last_name,
        email: email,
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Error processing transaction.' },
      { status: 500 },
    );
  }
}
