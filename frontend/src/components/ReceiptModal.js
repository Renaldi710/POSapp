import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ReceiptModal = ({ transaction, visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Receipt</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 400 }}>
            <View style={styles.details}>
              <Text>ID: #{transaction.id}</Text>
              <Text>Date: {new Date(transaction.created_at).toLocaleString()}</Text>
              <Text>Cashier: {transaction.user?.name}</Text>
              <Text>Status: {transaction.status}</Text>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRowHeader}>
                <Text style={styles.th}>Item</Text>
                <Text style={styles.th}>Qty</Text>
                <Text style={styles.th}>Price</Text>
                <Text style={styles.th}>Subtotal</Text>
              </View>
              {transaction.items.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.td}>{item.product.name}</Text>
                  <Text style={styles.td}>{item.quantity}</Text>
                  <Text style={styles.td}>${Number(item.price).toFixed(2)}</Text>
                  <Text style={styles.td}>${Number(item.subtotal).toFixed(2)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalAmount}>${Number(transaction.total_amount).toFixed(2)}</Text>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.printButton} onPress={() => {}}>
            <MaterialCommunityIcons name="printer" size={18} color="#fff" />
            <Text style={styles.printButtonText}>Print</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', width: '90%', borderRadius: 8, padding: 16, maxHeight: '80%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold' },
  details: { marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  table: { marginBottom: 12 },
  tableRowHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', paddingVertical: 4 },
  th: { flex: 1, fontWeight: '600', fontSize: 12 },
  tableRow: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#eee' },
  td: { flex: 1, fontSize: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#000', paddingTop: 8 },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  totalAmount: { fontSize: 18, fontWeight: 'bold' },
  printButton: { flexDirection: 'row', backgroundColor: '#2563eb', padding: 12, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  printButtonText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
});

export default ReceiptModal;
