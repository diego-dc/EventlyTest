import { PrismaClient } from '@prisma/client';

type EventDetailsProps = {
  params: { id: string };
};

const prisma = new PrismaClient();

export default async function Page({ params }: EventDetailsProps) {
  var { id } = await params;

  // Llamada a la base de datos para obtener el evento
  const event = await prisma.event.findUnique({
    where: { id: parseInt(id) },
  });

  if (!event) {
    // Manejar el caso de que el evento no exista
    return (
      <div>
        <h1>Event Not Found</h1>
        <p>The event with ID "{id}" does not exist.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Price: ${event.price}</p>
    </div>
  );
}
