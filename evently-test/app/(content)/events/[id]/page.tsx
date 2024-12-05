import Transaction from '@/components/transaction';
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
    <div className="p-10">
      <Transaction
        event_id={event.id}
        title={event.title}
        date={event.date.toString()}
        description={event.description}
        price={event.price}
        maxcapacity={event.maxcapacity}
      />
    </div>
  );
}
