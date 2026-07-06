import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import { usePOS } from '../context/POSContext';
import { productService } from '../services/products';
import { categoryService } from '../services/categories';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import CartItem from '../components/CartItem';
import ReceiptModal from '../components/ReceiptModal';

const POSScreen = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cart, total, checkout, receipt, setReceipt } = usePOS();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category_id == categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCheckout = async () => {
    try {
      await checkout();
    } catch (error) {}
  };

  const selectedCategoryName = categoryFilter ? categories.find(c => c.id == categoryFilter)?.name || 'All' : 'All';

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.categoryButton} onPress={() => setShowCategoryModal(true)}>
          <MaterialCommunityIcons name="filter" size={20} color="#fff" />
          <Text style={styles.categoryButtonText}>{selectedCategoryName}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showCategoryModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={[{ id: '', name: 'All' }, ...categories]}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, categoryFilter == item.id && styles.modalItemActive]}
                  onPress={() => {
                    setCategoryFilter(item.id);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowCategoryModal(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productGrid}
        />
      )}

      <View style={styles.cartArea}>
        <Text style={styles.cartHeader}>Cart</Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.product.id.toString()}
          renderItem={({ item }) => <CartItem item={item} />}
          ListEmptyComponent={<Text style={styles.emptyCart}>Cart is empty</Text>}
        />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutBtn, cart.length === 0 && styles.checkoutBtnDisabled]}
          onPress={handleCheckout}
          disabled={cart.length === 0}
        >
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      {receipt && (
        <ReceiptModal transaction={receipt} visible={true} onClose={() => setReceipt(null)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  searchRow: { flexDirection: 'row', padding: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd', alignItems: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 4, paddingHorizontal: 8, flex: 1, marginRight: 8 },
  searchInput: { flex: 1, padding: 8 },
  categoryButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  categoryButtonText: { color: '#fff', marginLeft: 4, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '80%', borderRadius: 8, padding: 16, maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  modalItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemActive: { backgroundColor: '#dbeafe' },
  modalItemText: { fontSize: 16 },
  modalClose: { marginTop: 12, padding: 12, backgroundColor: '#e5e7eb', borderRadius: 4, alignItems: 'center' },
  modalCloseText: { color: '#333' },
  productGrid: { padding: 8 },
  cartArea: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd', padding: 12, maxHeight: '35%' },
  cartHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  emptyCart: { textAlign: 'center', color: '#999', marginTop: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 12 },
  totalLabel: { fontSize: 16, fontWeight: '600' },
  totalValue: { fontSize: 18, fontWeight: 'bold' },
  checkoutBtn: { backgroundColor: '#16a34a', padding: 12, borderRadius: 6, alignItems: 'center' },
  checkoutBtnDisabled: { backgroundColor: '#9ca3af' },
  checkoutBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default POSScreen;
