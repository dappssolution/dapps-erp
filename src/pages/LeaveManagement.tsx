import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchLeaves, addLeave, updateLeave, deleteLeave } from '@/store/leaveSlice';
import { LeaveRecord, PARTNERS, Partner, LEAVE_TYPES, LeaveType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Pencil, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaveManagement() {
  const dispatch = useAppDispatch();
  const { records } = useAppSelector(s => s.leave);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveRecord | null>(null);
  const [form, setForm] = useState({ partner: PARTNERS[0] as Partner, date: new Date().toISOString().split('T')[0], leaveType: LEAVE_TYPES[0] as LeaveType, reason: '' });
  const [filterPartner, setFilterPartner] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => { dispatch(fetchLeaves()); }, [dispatch]);

  const filtered = records.filter(r => {
    if (filterPartner !== 'all' && r.partner !== filterPartner) return false;
    if (filterMonth && !r.date.startsWith(filterMonth)) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const openNew = () => { setEditing(null); setForm({ partner: PARTNERS[0], date: new Date().toISOString().split('T')[0], leaveType: LEAVE_TYPES[0], reason: '' }); setOpen(true); };
  const openEdit = (r: LeaveRecord) => { setEditing(r); setForm({ partner: r.partner, date: r.date, leaveType: r.leaveType, reason: r.reason }); setOpen(true); };

  const handleSave = () => {
    if (editing) {
      dispatch(updateLeave({ ...editing, ...form }));
    } else {
      dispatch(addLeave({ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() }));
    }
    setOpen(false);
  };

  const getSummary = (partner: Partner) => {
    const pr = records.filter(r => r.partner === partner && r.date.startsWith(filterMonth));
    const daysInMonth = new Date(Number(filterMonth.split('-')[0]), Number(filterMonth.split('-')[1]), 0).getDate();
    const totalAbsent = pr.filter(r => r.leaveType !== 'Half Day').length + pr.filter(r => r.leaveType === 'Half Day').length * 0.5;
    return { total: pr.length, absent: totalAbsent, present: daysInMonth - totalAbsent, sick: pr.filter(r => r.leaveType === 'Sick Leave').length, casual: pr.filter(r => r.leaveType === 'Casual Leave').length, halfDay: pr.filter(r => r.leaveType === 'Half Day').length };
  };

  const leaveColor: Record<LeaveType, string> = {
    'Sick Leave': 'bg-destructive/20 text-destructive',
    'Casual Leave': 'bg-info/20 text-info',
    'Half Day': 'bg-warning/20 text-warning',
    'Absent': 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground text-sm">{records.length} total records</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Mark Leave</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="w-44 bg-card border-border" />
        <Select value={filterPartner} onValueChange={setFilterPartner}>
          <SelectTrigger className="w-44 bg-card border-border"><SelectValue placeholder="All Partners" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Partners</SelectItem>
            {PARTNERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PARTNERS.map(p => {
          const s = getSummary(p);
          return (
            <motion.div key={p} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-4 glow-border">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">{p}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Present:</span> <span className="font-medium text-success">{s.present}</span></div>
                <div><span className="text-muted-foreground">Absent:</span> <span className="font-medium text-destructive">{s.absent}</span></div>
                <div><span className="text-muted-foreground">Sick:</span> <span className="font-medium">{s.sick}</span></div>
                <div><span className="text-muted-foreground">Casual:</span> <span className="font-medium">{s.casual}</span></div>
                <div><span className="text-muted-foreground">Half Day:</span> <span className="font-medium">{s.halfDay}</span></div>
                <div><span className="text-muted-foreground">Total Leave:</span> <span className="font-medium">{s.total}</span></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Date</TableHead><TableHead>Partner</TableHead><TableHead>Type</TableHead><TableHead>Reason</TableHead><TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No leave records</TableCell></TableRow>
            )}
            {filtered.map(r => (
              <TableRow key={r.id} className="border-border">
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.partner}</TableCell>
                <TableCell><span className={`text-xs px-2 py-0.5 rounded-full ${leaveColor[r.leaveType]}`}>{r.leaveType}</span></TableCell>
                <TableCell className="text-muted-foreground">{r.reason}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-muted"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => dispatch(deleteLeave(r.id))} className="p-1.5 rounded hover:bg-destructive/20 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Mark'} Leave</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Partner</Label>
              <Select value={form.partner} onValueChange={v => setForm(f => ({ ...f, partner: v as Partner }))}>
                <SelectTrigger className="bg-background border-border mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{PARTNERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
            <div>
              <Label>Leave Type</Label>
              <Select value={form.leaveType} onValueChange={v => setForm(f => ({ ...f, leaveType: v as LeaveType }))}>
                <SelectTrigger className="bg-background border-border mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{LEAVE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason</Label>
              <Input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
            <Button onClick={handleSave} className="w-full">{editing ? 'Update' : 'Mark'} Leave</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
