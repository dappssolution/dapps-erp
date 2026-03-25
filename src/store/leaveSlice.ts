import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaveRecord } from '@/types';
import { leaveApi } from '@/services/api';
import { toast } from 'sonner';

interface LeaveState {
  records: LeaveRecord[];
  loading: boolean;
}

const initialState: LeaveState = { records: [], loading: false };

export const fetchLeaves = createAsyncThunk('leave/fetchAll', async (_, { rejectWithValue }) => {
  try { return await leaveApi.getAll(); } catch (e: any) { toast.error('Failed to load leaves: ' + e.message); return rejectWithValue(e.message); }
});
export const addLeave = createAsyncThunk('leave/add', async (item: LeaveRecord, { rejectWithValue }) => {
  try { const result = await leaveApi.create(item); toast.success('Leave marked!'); return result; } catch (e: any) { toast.error('Failed to mark leave: ' + e.message); return rejectWithValue(e.message); }
});
export const updateLeave = createAsyncThunk('leave/update', async (item: LeaveRecord, { rejectWithValue }) => {
  try { const result = await leaveApi.update(item); toast.success('Leave updated!'); return result; } catch (e: any) { toast.error('Failed to update: ' + e.message); return rejectWithValue(e.message); }
});
export const deleteLeave = createAsyncThunk('leave/delete', async (id: string, { rejectWithValue }) => {
  try { await leaveApi.delete(id); toast.success('Leave deleted!'); return id; } catch (e: any) { toast.error('Failed to delete: ' + e.message); return rejectWithValue(e.message); }
});

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (s) => { s.loading = true; })
      .addCase(fetchLeaves.fulfilled, (s, a) => { s.records = a.payload; s.loading = false; })
      .addCase(fetchLeaves.rejected, (s) => { s.loading = false; })
      .addCase(addLeave.fulfilled, (s, a) => { s.records.push(a.payload); })
      .addCase(updateLeave.fulfilled, (s, a) => {
        const idx = s.records.findIndex(i => i.id === a.payload.id);
        if (idx >= 0) s.records[idx] = a.payload;
      })
      .addCase(deleteLeave.fulfilled, (s, a) => { s.records = s.records.filter(i => i.id !== a.payload); });
  },
});

export default leaveSlice.reducer;
