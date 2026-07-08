import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native';
import { productService } from '../services/products';
import { categoryService } from '../services/categories';

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', category_id: '', price: '', stock: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([productService.getAll(), categoryService.getAll()]);
      setProducts(p);
      setCategories(c);
    } catch (e) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.category_id || !form.price || !form.stock) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        category_id: Number(form.category_id),
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (editing) {
        await productService.update(editing, payload);
      } else {
        await productService.create(payload);
      }
      setForm({ name: '', category_id: '', price: '', stock: '' });
      setEditing(null);
      setShowForm(false);
      await fetch();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      stock: product.stock,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm', 'Delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await productService.delete(id);
            await fetch();
          } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete product');
          }
        }
      }
    ]);
  };

  const selectedCategory = categories.find(c => c.id == form.category_id)?.name || 'Select category';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => { setEditing(null); setForm({ name: '', category_id: '', price: '', stock: '' }); setShowForm(true); }}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editing ? 'Edit Product' : 'Add Product'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={form.name}
            onChangeText={text => setForm({ ...form, name: text })}
          />
          <TouchableOpacity style={styles.input} onPress={() => setCategoryModalVisible(true)}>
            <Text>{selectedCategory}</Text>
          </TouchableOpacity>
          <Modal visible={categoryModalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalSubtitle}>Select Category</Text>
                <FlatList
                  data={categories}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.modalItem} onPress={() => { setForm({ ...form, category_id: item.id }); setCategoryModalVisible(false); }}>
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
                <Button title="Cancel" onPress={() => setCategoryModalVisible(false)} />
              </View>
            </View>
          </Modal>
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={form.price}
            onChangeText={text => setForm({ ...form, price: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Stock"
            value={form.stock}
            onChangeText={text => setForm({ ...form, stock: text })}
            keyboardType="numeric"
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => { setShowForm(false); setEditing(null); }} />
            <Button title={editing ? 'Update' : 'Add'} onPress={handleSubmit} />
          </View>
        </View>
      </Modal>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemName}>{item.name}</Text>
                <Text style={styles.listItemSub}>{item.category?.name} | ${Number(item.price).toFixed(2)} | Stok: {item.stock}</Text>
              </View>
              <View style={styles.listItemActions}>
                <Button title="Edit" onPress={() => handleEdit(item)} />
                <Button title="Delete" color="red" onPress={() => handleDelete(item.id)} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  addButton: { backgroundColor: '#2563eb', padding: 8, borderRadius: 4 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  modalSubtitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 12, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '80%', borderRadius: 8, padding: 16 },
  modalItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  listItem: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  listItemName: { fontSize: 16, fontWeight: '500' },
  listItemSub: { color: '#666', fontSize: 12, marginTop: 2 },
  listItemActions: { flexDirection: 'row', gap: 8 },
});

export default ProductsScreen;
