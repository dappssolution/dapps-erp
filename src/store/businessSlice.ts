import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BusinessNumber } from '@/types';
import { businessNumbersApi } from '@/services/api';

interface BusinessState {
  items: BusinessNumber[];
  loading: boolean;
}

const initialState: BusinessState = { items: [], loading: false };

export const fetchBusinessNumbers = createAsyncThunk('business/fetchAll', () => businessNumbersApi.getAll());
export const addBusinessNumber = createAsyncThunk('business/add', (item: BusinessNumber) => businessNumbersApi.create(item));
export const updateBusinessNumber = createAsyncThunk('business/update', (item: BusinessNumber) => businessNumbersApi.update(item));
export const deleteBusinessNumber = createAsyncThunk('business/delete', async (id: string) => { await businessNumbersApi.delete(id); return id; });

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessNumbers.pending, (s) => { s.loading = true; })
      .addCase(fetchBusinessNumbers.fulfilled, (s, a) => { s.items = a.payload; s.loading = false; })
      .addCase(addBusinessNumber.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateBusinessNumber.fulfilled, (s, a) => {
        const idx = s.items.findIndex(i => i.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(deleteBusinessNumber.fulfilled, (s, a) => { s.items = s.items.filter(i => i.id !== a.payload); });
  },
});

export default businessSlice.reducer;
