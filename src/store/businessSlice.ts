import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BusinessNumber } from '@/types';
import { businessNumbersApi } from '@/services/api';
import { toast } from 'sonner';

interface BusinessState {
  items: BusinessNumber[];
  loading: boolean;
}

const initialState: BusinessState = { items: [], loading: false };

export const fetchBusinessNumbers = createAsyncThunk('business/fetchAll', async (_, { rejectWithValue }) => {
  try { return await businessNumbersApi.getAll(); } catch (e: any) { toast.error('Failed to load contacts: ' + e.message); return rejectWithValue(e.message); }
});
export const addBusinessNumber = createAsyncThunk('business/add', async (item: BusinessNumber, { rejectWithValue }) => {
  try { const result = await businessNumbersApi.create(item); toast.success('Contact added!'); return result; } catch (e: any) { toast.error('Failed to add contact: ' + e.message); return rejectWithValue(e.message); }
});
export const updateBusinessNumber = createAsyncThunk('business/update', async (item: BusinessNumber, { rejectWithValue }) => {
  try { const result = await businessNumbersApi.update(item); toast.success('Contact updated!'); return result; } catch (e: any) { toast.error('Failed to update: ' + e.message); return rejectWithValue(e.message); }
});
export const deleteBusinessNumber = createAsyncThunk('business/delete', async (id: string, { rejectWithValue }) => {
  try { await businessNumbersApi.delete(id); toast.success('Contact deleted!'); return id; } catch (e: any) { toast.error('Failed to delete: ' + e.message); return rejectWithValue(e.message); }
});

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessNumbers.pending, (s) => { s.loading = true; })
      .addCase(fetchBusinessNumbers.fulfilled, (s, a) => { s.items = a.payload; s.loading = false; })
      .addCase(fetchBusinessNumbers.rejected, (s) => { s.loading = false; })
      .addCase(addBusinessNumber.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateBusinessNumber.fulfilled, (s, a) => {
        const idx = s.items.findIndex(i => i.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(deleteBusinessNumber.fulfilled, (s, a) => { s.items = s.items.filter(i => i.id !== a.payload); });
  },
});

export default businessSlice.reducer;
