import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, Button } from 'react-native';
import { categoryService } from '../services/categories';

const CategoriesScreen = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (editing) {
        await categoryService.update(editing, { name });
      } else {
        await categoryService.create({ name });
      }
      setName('');
      setEditing(null);
      setShowForm(false);
      await fetch();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat.id);
    setName(cat.name);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm', 'Delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { try { await categoryService.delete(id); await fetch(); } catch (e) { Alert.alert('Error', 'Failed to delete category'); } } }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => { setEditing(null); setName(''); setShowForm(true); }}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editing ? 'Edit Category' : 'Add Category'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Category name"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => { setShowForm(false); setEditing(null); setName(''); }} />
            <Button title={editing ? 'Update' : 'Add'} onPress={handleSubmit} />
          </View>
        </View>
      </Modal>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemText}>{item.name}</Text>
                <Text style={styles.listItemSub}>{item.products_count} products</Text>
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
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 12, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  listItem: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  listItemText: { fontSize: 16, fontWeight: '500' },
  listItemSub: { color: '#666', fontSize: 12, marginTop: 2 },
  listItemActions: { flexDirection: 'row', gap: 8 },
});

export default CategoriesScreen;
