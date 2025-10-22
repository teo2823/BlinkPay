import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from './cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );

  const handleIncrement = (productId: string) => {
    dispatch(incrementQuantity(productId));
  };

  const handleDecrement = (productId: string) => {
    dispatch(decrementQuantity(productId));
  };

  const handleRemove = (productId: string, productName: string) => {
    Alert.alert(
      'Eliminar producto',
      `¿Estás seguro de eliminar "${productName}" del carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => dispatch(removeFromCart(productId)),
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de continuar');
      return;
    }
    Alert.alert(
      'Checkout',
      `Total a pagar: $${totalPrice.toLocaleString('es-CO')}\n\nPróximamente: integración con Wompi`
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Vaciar carrito',
      '¿Estás seguro de eliminar todos los productos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Vaciar',
          style: 'destructive',
          onPress: () => dispatch(clearCart()),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tu carrito</Text>
        {items.length > 0 && (
          <View style={styles.headerInfo}>
            <Text style={styles.itemCount}>
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </Text>
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearButton}>Vaciar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>
            Agrega productos para comenzar tu compra
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.productInfo}>
                  <View style={styles.productDetails}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.product.name}
                    </Text>
                    <Text style={styles.productPrice}>
                      ${item.product.price.toLocaleString('es-CO')}
                    </Text>
                    <Text style={styles.stockInfo}>
                      Stock disponible: {item.product.stock}
                    </Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleDecrement(item.product.id)}>
                      <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.quantityDisplay}>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                    </View>
                    
                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        item.quantity >= item.product.stock && styles.quantityButtonDisabled,
                      ]}
                      onPress={() => handleIncrement(item.product.id)}
                      disabled={item.quantity >= item.product.stock}>
                      <Text style={[
                        styles.quantityButtonText,
                        item.quantity >= item.product.stock && styles.quantityButtonTextDisabled,
                      ]}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.itemFooter}>
                    <Text style={styles.subtotal}>
                      ${(item.product.price * item.quantity).toLocaleString('es-CO')}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemove(item.product.id, item.product.name)}>
                      <Text style={styles.removeButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>
                  ${totalPrice.toLocaleString('es-CO')}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>
                  ${totalPrice.toLocaleString('es-CO')}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              activeOpacity={0.8}>
              <Text style={styles.checkoutButtonText}>Proceder al pago</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00122a',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#B0BEC5',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#0B1E3B',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#133b63',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B0BEC5',
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff5252',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    backgroundColor: '#0B1E3B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#133b63',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  productInfo: {
    marginBottom: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00E676',
    marginBottom: 4,
  },
  stockInfo: {
    fontSize: 12,
    color: '#78909C',
  },
  actions: {
    gap: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 36,
    height: 36,
    backgroundColor: '#13294B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#13294B',
    opacity: 0.4,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  quantityButtonTextDisabled: {
    color: '#78909C',
  },
  quantityDisplay: {
    flex: 1,
    backgroundColor: '#13294B',
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtotal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a0d0d',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff5252',
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ff5252',
  },
  footer: {
    backgroundColor: '#0B1E3B',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    borderTopWidth: 2,
    borderTopColor: '#133b63',
  },
  totalContainer: {
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#B0BEC5',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#133b63',
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  grandTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00E676',
  },
  checkoutButton: {
    backgroundColor: '#00E676',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#001a3d',
  },
});
