import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} from '../features/cart/cartSlice';
import { Product } from '../types/products';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { items, totalItems, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );
  
  const addProduct = (product: Product, quantity: number = 1) => {
    dispatch(addToCart({ product, quantity }));
  };
  
  const removeProduct = (productId: string) => {
    dispatch(removeFromCart(productId));
  };
  
  const updateProductQuantity = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };
  
  const clearCartItems = () => {
    dispatch(clearCart());
  };
  
  const incrementItem = (productId: string) => {
    dispatch(incrementQuantity(productId));
  };
  
  const decrementItem = (productId: string) => {
    dispatch(decrementQuantity(productId));
  };
  
  return {
    cartItems: items,
    totalItems,
    totalPrice,
    addProduct,
    removeProduct,
    updateProductQuantity,
    clearCartItems,
    incrementItem,
    decrementItem,
  };
};

