import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Product } from '../../../types/products';
import { formatPrice } from '../../../utils/formatPrice';
import { useCart } from '../../../hooks/useCart';

interface ProductCardProps {
  item: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const { addProduct } = useCart();

  const increaseQuantity = () => {
    if (quantity < item.stock) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  
  const handleAddToCart = () => {
    addProduct(item, quantity);
    setQuantity(1);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={decreaseQuantity}
            style={[styles.qtyButton, quantity === 1 && styles.qtyButtonDisabled]}
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qtyValue}>{quantity}</Text>

          <TouchableOpacity
            onPress={increaseQuantity}
            style={[
              styles.qtyButton,
              quantity === item.stock && styles.qtyButtonDisabled,
            ]}
          >
            <Text style={styles.qtyButtonText}>＋</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.buyButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.buyButtonText}>Agregar ({quantity})</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.stock}>Disponible: {item.stock}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0B1E3B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#133b63',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00E676',
  },
  description: {
    color: '#B0BEC5',
    fontSize: 14,
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13294B',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  qtyButton: {
    padding: 8,
  },
  qtyButtonDisabled: {
    opacity: 0.4,
  },
  qtyButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  qtyValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 6,
  },
  buyButton: {
    backgroundColor: '#00E676',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  buyButtonText: {
    color: '#001a3d',
    fontSize: 16,
    fontWeight: '700',
  },
  stock: {
    fontSize: 13,
    color: '#78909C',
    marginTop: 8,
    textAlign: 'right',
  },
});

