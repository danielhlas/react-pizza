import {createSlice} from "@reduxjs/toolkit"

const initialState = {
  cart: [],
};

//example:
// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: 'Mediterranean',
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: 'Vegetale',
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: 'Spinach and Mushroom',
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

const cartSlice = createSlice({
  name: "cart", 
  initialState,
  reducers: {   
	   addItem(state, action) {
      state.cart = [...state.cart, action.payload];
		 },
	   deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
		 },
	   increaceItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
		 },
	   decreaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);

      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;

      if(item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
		 },
	   clearCart(state, action) {
      state.cart = [];
		 },
    }
});


//Calculations for variables:
export const numberOfOrderedPizzas = (state) => state.cart.cart.reduce((acc, currItem) => acc + currItem.quantity, 0);
export const sumPriceOfCart = (state) => state.cart.cart.reduce((acc, currItem) => acc + currItem.totalPrice, 0);
export const getCartItems = (state) => state.cart.cart; 
export const getCurrentQuantity = id => state => state.cart.cart.find(item => item.pizzaId === id)?.quantity ?? 0;

export const {
  addItem, 
  deleteItem, 
  increaceItemQuantity, 
  decreaseItemQuantity, 
  clearCart
} = cartSlice.actions //export action creatoru
export default cartSlice.reducer; // export reduceru