import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    products: [],
    selectedProduct: {},
    loading: false,
    error: null,
};

const BASE_URL = "http://localhost:5000/api";

export const getAllProducts = createAsyncThunk(
    "getAllProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/products`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch products"
            );
        }
    }
);

export const getProductById = createAsyncThunk(
    "getProductById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/products/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch product details"
            );
        }
    }
);

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;