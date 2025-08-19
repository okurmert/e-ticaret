import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import basketReducer from './slices/basketSlice';
import appReducer from './slices/appslice';


const store = configureStore({
    reducer: {
        product: productReducer,
        basket: basketReducer,
        app: appReducer,
    },
});

export default store;