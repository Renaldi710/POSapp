import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePOS } from '../context/POSContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = usePOS();

  const decrease = () => {
    if (item.quantity > 1) updateQuantity(item.product.id, item.quantity - 1);
  };

  return (
    <View style={styles.row}>
      <View style={{ flex: 3 }}>
        <Text style={styles.name}>{item.product.name}</Text>
        <Text style={styles.price}>@{Number(item.price).toFixed(2)}</Text>
      </View>
      <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={decrease} style={styles.qtyButton}>
          <MaterialCommunityIcons name="minus" size={16} color="#333" />
        </TouchableOpacity>
        <Text style={styles.qty}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.product.id, item.quantity + 1)} style={styles.qtyButton}>
          <MaterialCommunityIcons name="plus" size={16} color="#333" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.deleteButton}>
        <MaterialCommunityIcons name="trash-can" size={16} color="#dc2626" />
      </TouchableOpacity>
      <Text style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontSize: 14, fontWeight: '500' },
  price: { fontSize: 12, color: '#666' },
  qtyButton: { padding: 4, backgroundColor: '#e5e7eb', borderRadius: 4 },
  qty: { width: 24, textAlign: 'center', fontSize: 14 },
  deleteButton: { padding: 4, marginLeft: 8 },
  subtotal: { flex: 1, textAlign: 'right', fontWeight: '600', fontSize: 14 },
});

export default CartItem;
