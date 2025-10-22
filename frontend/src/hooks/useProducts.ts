import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchProducts } from '../features/products/productsSlice';

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { items: products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  const refetch = () => {
    dispatch(fetchProducts());
  };
  
  return {
    products,
    loading,
    error,
    refetch,
  };
};

export default useProducts;