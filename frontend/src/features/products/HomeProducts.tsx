import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '../../types/products';
import { ProductCard } from './components/ProductCard';
import { SummaryBadge } from './components/SummaryBadge';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';

export default function HomeProducts() {
  const { products, loading, refetch } = useProducts();
  
  const { totalItems } = useCart();

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard item={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>BlinkPay</Text>
          <Text style={styles.subtitle}>Productos disponibles</Text>
        </View>
      </View>
      
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          totalItems > 0 && styles.listContentWithCart,
        ]}
        refreshing={loading}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? 'Cargando productos...' : 'No hay productos disponibles'}
          </Text>
        }
      />
      
      <SummaryBadge />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00122a',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  cartBadge: {
    backgroundColor: '#00E676',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#001a3d',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  listContentWithCart: {
    paddingBottom: 110, 
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});
