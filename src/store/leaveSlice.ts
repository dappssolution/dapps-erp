import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaveRecord } from '@/types';
import { leaveApi } from '@/services/api';

interface LeaveState {
  records: LeaveRecord[];
  loading: boolean;
}

const initialState: LeaveState = { records: [], loading: false };

export const fetchLeaves = createAsyncThunk('leave/fetchAll', () => leaveApi.getAll());
export const addLeave = createAsyncThunk('leave/add', (item: LeaveRecord) => leaveApi.create(item));
export const updateLeave = createAsyncThunk('leave/update', (item: LeaveRecord) => leaveApi.update(item));
export const deleteLeave = createAsyncThunk('leave/delete', async (id: string) => { await leaveApi.delete(id); return id; });

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (s) => { s.loading = true; })
      .addCase(fetchLeaves.fulfilled, (s, a) => { s.records = a.payload; s.loading = false; })
      .addCase(addLeave.fulfilled, (s, a) => { s.records.push(a.payload); })
      .addCase(updateLeave.fulfilled, (s, a) => {
        const idx = s.records.findIndex(i => i.id === a.payload.id);
        if (idx >= 0) s.records[idx] = a.payload;
      })
      .addCase(deleteLeave.fulfilled, (s, a) => { s.records = s.records.filter(i => i.id !== a.payload); });
  },
});

export default leaveSlice.reducer;
