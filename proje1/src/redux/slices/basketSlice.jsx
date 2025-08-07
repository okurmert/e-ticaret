import Drawer from '@mui/material/Drawer';
import { createSlice } from '@reduxjs/toolkit'

const getBasketFromStorage = () => {
    if (localStorage.getItem("basket")) {
        return JSON.parse(localStorage.getItem("basket"));
    }
    return [];
}

const initialState = {
    products: getBasketFromStorage(),
    drawer: false,
    totalPrice: 0,

}

const writeFromBasketToStorage = (basket) => {
    localStorage.setItem("basket", JSON.stringify(basket))
}

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        addToBasket: (state, action) => {
            const findProduct = state.products && state.products.find((product) => product.id === action.payload.id);
            if (findProduct) {
                const extractedProducts = state.products.filter((product) => product.id != action.payload.id);
                findProduct.count += action.payload.count;
                state.products = [...extractedProducts, findProduct];
                writeFromBasketToStorage(state.products);

            } else {
                state.products = [...state.products, action.payload];
                writeFromBasketToStorage(state.products);
            }
        },

        setDrawer: (state) => {
            state.drawer = !state.drawer;
        },
        calculateBasket: (state) => {
            state.totalPrice = 0;
            state.products && state.products.map((product) => {
                state.totalPrice += product.price * product.count;
            })
        }
    }
})

export const { addToBasket, setDrawer, calculateBasket } = basketSlice.actions
export default basketSlice.reducer