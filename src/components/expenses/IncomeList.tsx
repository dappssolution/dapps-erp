import type { Income } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, TrendingUp } from 'lucide-react';

interface Props {
  incomes: Income[];
  onDelete: (id: string) => void;
}

export default function IncomeList({ incomes, onDelete }: Props) {
  const sorted = [...incomes].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-success" />
        <h2 className="font-semibold text-lg">Income Records</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead>Date</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map(i => (
            <TableRow key={i.id} className="border-border">
              <TableCell>{i.date}</TableCell>
              <TableCell>{i.source}</TableCell>
              <TableCell className="font-medium text-success">₹{i.amount.toLocaleString()}</TableCell>
              <TableCell><button onClick={() => onDelete(i.id)} className="p-1 rounded hover:bg-destructive/20 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button></TableCell>
            </TableRow>
          ))}
          {sorted.length === 0 && (
            <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No income records</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
