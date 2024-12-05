'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';

// Define the data structure for the transaction
interface TransactionData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  eventId: number;
  tickets: number;
  amount: number;
}

// Define the data structure for the event
interface eventData {
  id: string;
  title: string;
  description: string;
  date: string;
  price: number;
  maxCapacity: number;
}

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]); // Initialize the state for transactions

  // Fetch the transactions from the API
  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch('/api/transactions'); // Fetch the transactions from the API
      const data = await response.json(); // Parse the JSON response
      setTransactions(data); // Update the state with the transactions
    }

    // Call the fetchTransactions function
    fetchTransactions();
  }, []);

  // Calculate the total amount of all transactions
  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  return (
    <Table>
      <TableCaption>A list of your recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[75px]">id</TableHead>
          <TableHead className="w-[100px]">tickets</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Event id</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.id}</TableCell>
            <TableCell className="font-medium">{transaction.tickets}</TableCell>
            <TableCell>
              {transaction.firstName} {transaction.lastName}
            </TableCell>
            <TableCell>{transaction.email}</TableCell>
            <TableCell>{transaction.eventId}</TableCell>
            <TableCell className="text-right">{transaction.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total</TableCell>
          <TableCell className="text-right">
            ${totalAmount.toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
