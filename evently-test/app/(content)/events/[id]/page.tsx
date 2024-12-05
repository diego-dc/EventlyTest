import Transaction from '@/components/transaction';
import { PrismaClient } from '@prisma/client';

// Initialize the PrismaClient instance for database operations
const prisma = new PrismaClient();

// Define the Next.js page component
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id; // Extract the "id" parameter from the props

  // Fetch the event details from the database based on the provided ID
  const event = await prisma.event.findUnique({
    where: { id: parseInt(id) },
  });

  // Handle the case where the event does not exist in the database
  if (!event) {
    return (
      <div>
        <h1>Event Not Found</h1>
        <p>The event with ID "{id}" does not exist.</p>
      </div>
    );
  }

  // Render the Transaction component with the fetched event details
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
