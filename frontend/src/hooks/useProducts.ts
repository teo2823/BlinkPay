import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchProducts } from '../features/products/productsSlice';

/**
 * Hook personalizado para manejar productos con Redux
 * 
 * Retorna:
 * - products: array de productos
 * - loading: estado de carga
 * - error: mensaje de error si existe
 * - refetch: función para recargar productos
 */
export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Obtener datos del estado de Redux
  const { items: products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  
  // Cargar productos al montar el componente
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  // Función para recargar productos manualmente
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

