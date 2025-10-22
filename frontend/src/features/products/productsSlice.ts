import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/products';
import httpManager from '../../network/HttpManager';

// Estado inicial del slice de productos
interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

// Thunk asíncrono para cargar productos desde el backend
// Este thunk se ejecuta automáticamente y maneja los estados: pending, fulfilled, rejected
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpManager.get<Product[]>('/products');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar productos');
    }
  }
);

// Slice de productos
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Reducer para limpiar errores manualmente si es necesario
    clearError: (state) => {
      state.error = null;
    },
  },
  // extraReducers maneja las acciones asíncronas del thunk
  extraReducers: (builder) => {
    builder
      // Cuando la petición está en curso
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Cuando la petición es exitosa
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      // Cuando la petición falla
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;
