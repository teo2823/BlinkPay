import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils/formatPrice';
import { useNavigation } from '@react-navigation/native';

export const SummaryBadge: React.FC = () => {
  const { totalItems, totalPrice } = useCart();
  const navigation = useNavigation();
  if (totalItems === 0) {
    return null;
  }

  const handleViewCart = () => {
    navigation.navigate('Cart')
  };

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <View style={styles.infoSection}>
          <View style={styles.itemsBadge}>
            <Text style={styles.itemsCount}>{totalItems}</Text>
          </View>
          <View style={styles.priceSection}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.viewCartButton}
          onPress={handleViewCart}
          activeOpacity={0.8}
        >
          <Text style={styles.viewCartText}>Ver carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, 
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  badge: {
    backgroundColor: '#0B1E3B',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#00E676',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    minHeight: 70, 
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemsBadge: {
    backgroundColor: '#00E676',
    borderRadius: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemsCount: {
    color: '#001a3d',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceSection: {
    flex: 1,
  },
  totalLabel: {
    color: '#B0BEC5',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  totalPrice: {
    color: '#00E676',
    fontSize: 20,
    fontWeight: '700',
  },
  viewCartButton: {
    backgroundColor: '#00E676',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42, 
  },
  viewCartText: {
    color: '#001a3d',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});

