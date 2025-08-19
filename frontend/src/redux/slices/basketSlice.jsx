import { createSlice } from '@reduxjs/toolkit';

const getBasketFromStorage = () => {
    if (localStorage.getItem("basket")) {
        return JSON.parse(localStorage.getItem("basket"));
    }
    return [];
}

const writeToBasketStorage = (basket) => {
    localStorage.setItem("basket", JSON.stringify(basket));
}

const initialState = {
    products: getBasketFromStorage(),
    drawer: false,
    totalPrice: 0,
}

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        addToBasket: (state, action) => {
            const findProduct = state.products.find((product) => product.id === action.payload.id);
            if (findProduct) {
                const extractedProducts = state.products.filter((product) => product.id !== action.payload.id);
                findProduct.count += action.payload.count;
                state.products = [...extractedProducts, findProduct];
            } else {
                state.products = [...state.products, action.payload];
            }
            writeToBasketStorage(state.products);
        },

        removeFromBasket: (state, action) => {
            state.products = state.products.filter(item => item.id !== action.payload);
            state.totalPrice = state.products.reduce(
                (sum, item) => sum + item.price * item.count,
                0
            );
            writeToBasketStorage(state.products); // if you persist basket
        },

        setDrawer: (state) => {
            state.drawer = !state.drawer;
        },

        calculateBasket: (state) => {
            state.totalPrice = state.products.reduce((total, product) => {
                return total + (product.price * product.count);
            }, 0);
        }
    }
});

export const { addToBasket, removeFromBasket, setDrawer, calculateBasket } = basketSlice.actions;
export default basketSlice.reducer;