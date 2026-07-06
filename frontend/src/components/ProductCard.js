import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePOS } from '../context/POSContext';

const ProductCard = ({ product }) => {
  const { addToCart } = usePOS();

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.category}>{product.category?.name}</Text>
      <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
      <Text style={styles.stock}>Stok: {product.stock}</Text>
      <TouchableOpacity
        style={[styles.button, product.stock <= 0 && styles.buttonDisabled]}
        onPress={() => addToCart(product)}
        disabled={product.stock <= 0}
      >
        <Text style={styles.buttonText}>Tambah</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 12, margin: 8, elevation: 2, flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  category: { fontSize: 12, color: '#666' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#2563eb', marginVertical: 4 },
  stock: { fontSize: 12, color: '#999' },
  button: { backgroundColor: '#2563eb', padding: 8, borderRadius: 4, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#9ca3af' },
  buttonText: { color: '#fff', fontWeight: '600' },
});

export default ProductCard;
