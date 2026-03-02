import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchBusinessNumbers, addBusinessNumber, updateBusinessNumber, deleteBusinessNumber } from '@/store/businessSlice';
import { BusinessNumber, REQUIREMENT_OPTIONS, RequirementType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Pencil, Trash2, Download, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const emptyForm: Omit<BusinessNumber, 'id' | 'createdAt' | 'updatedAt'> = {
  businessName: '', agentName: '', role: '', number: '', number2: '',
  location: '', requirements: [], description: '',
};

export default function BusinessNumbers() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector(s => s.business);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BusinessNumber | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof BusinessNumber>('businessName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => { dispatch(fetchBusinessNumbers()); }, [dispatch]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = items.filter(i =>
      i.businessName.toLowerCase().includes(q) ||
      i.agentName.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      i.number.includes(q)
    );
    list.sort((a, b) => {
      const va = String(a[sortField]).toLowerCase();
      const vb = String(b[sortField]).toLowerCase();
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [items, search, sortField, sortDir]);

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (item: BusinessNumber) => { setEditing(item); setForm(item); setOpen(true); };

  const handleSave = () => {
    const now = new Date().toISOString();
    if (editing) {
      dispatch(updateBusinessNumber({ ...editing, ...form, updatedAt: now }));
    } else {
      dispatch(addBusinessNumber({ ...form, id: crypto.randomUUID(), createdAt: now, updatedAt: now }));
    }
    setOpen(false);
  };

  const toggleReq = (req: RequirementType) => {
    setForm(f => ({
      ...f,
      requirements: f.requirements.includes(req)
        ? f.requirements.filter(r => r !== req)
        : [...f.requirements, req],
    }));
  };

  const toggleSort = (field: keyof BusinessNumber) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const exportExcel = async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Business Numbers');
    ws.columns = [
      { header: 'Business Name', key: 'businessName', width: 25 },
      { header: 'Agent Name', key: 'agentName', width: 20 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Number', key: 'number', width: 18 },
      { header: 'Number 2', key: 'number2', width: 18 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Requirements', key: 'requirements', width: 35 },
      { header: 'Description', key: 'description', width: 40 },
    ];
    items.forEach(i => ws.addRow({ ...i, requirements: i.requirements.join(', ') }));
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), 'business-numbers.xlsx');
  };

  const reqLabels: Record<RequirementType, string> = {
    webDevelopment: 'Web Dev', appDevelopment: 'App Dev', marketing: 'Marketing',
    seo: 'SEO', video: 'Video', photo: 'Photo', eCommerce: 'E-Commerce',
    erp: 'ERP', crm: 'CRM', aiServices: 'AI Services',
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Business Numbers</h1>
          <p className="text-muted-foreground text-sm">{items.length} contacts</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-60 bg-card border-border" />
          </div>
          <Button variant="outline" onClick={exportExcel}><Download className="w-4 h-4 mr-2" />Excel</Button>
          <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Add</Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/30">
                {(['businessName', 'agentName', 'role', 'number', 'location'] as const).map(f => (
                  <TableHead key={f} className="cursor-pointer select-none" onClick={() => toggleSort(f)}>
                    <span className="flex items-center gap-1 capitalize">
                      {f.replace(/([A-Z])/g, ' $1').trim()}
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </TableHead>
                ))}
                <TableHead>Requirements</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No contacts found</TableCell></TableRow>
              )}
              {filtered.map(item => (
                <TableRow key={item.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium">{item.businessName}</TableCell>
                  <TableCell>{item.agentName}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.number}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.requirements.map(r => (
                        <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{reqLabels[r]}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => dispatch(deleteBusinessNumber(item.id))} className="p-1.5 rounded hover:bg-destructive/20 text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} Business Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {[
              { label: 'Business Name', key: 'businessName' },
              { label: 'Agent Name', key: 'agentName' },
              { label: 'Role', key: 'role' },
              { label: 'Number', key: 'number' },
              { label: 'Number 2', key: 'number2' },
              { label: 'Location', key: 'location' },
            ].map(({ label, key }) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="bg-background border-border mt-1" />
              </div>
            ))}
            <div>
              <Label>Requirements</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {REQUIREMENT_OPTIONS.map(r => (
                  <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={form.requirements.includes(r)} onCheckedChange={() => toggleReq(r)} />
                    {reqLabels[r]}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
            <Button onClick={handleSave} className="w-full">{editing ? 'Update' : 'Add'} Contact</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
