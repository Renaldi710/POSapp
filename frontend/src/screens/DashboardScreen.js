import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { productService } from '../services/products';
import { categoryService } from '../services/categories';
import { transactionService } from '../services/transactions';

const DashboardScreen = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, transactions: 0, revenue: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [products, categories, transactions] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
          transactionService.getAll(),
        ]);
        setStats({
          products: products.length,
          categories: categories.length,
          transactions: transactions.length,
          revenue: transactions.reduce((sum, t) => sum + Number(t.total_amount), 0),
        });
        setRecentTransactions(transactions.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const StatCard = ({ label, value, iconName, color }) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <MaterialCommunityIcons name={iconName} size={32} color={color} />
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );

  const renderTransaction = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.colId}>#{item.id}</Text>
      <Text style={styles.colDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
      <Text style={styles.colName}>{item.user?.name}</Text>
      <Text style={styles.colAmount}>${Number(item.total_amount).toFixed(2)}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.heading}>Dashboard</Text>
      <View style={styles.statsRow}>
        <StatCard label="Products" value={stats.products} iconName="package" color="#2563eb" />
        <StatCard label="Categories" value={stats.categories} iconName="format-list-bulleted" color="#16a34a" />
        <StatCard label="Transactions" value={stats.transactions} iconName="clipboard-text" color="#9333ea" />
        <StatCard label="Revenue" value={`$${stats.revenue.toFixed(2)}`} iconName="cash-multiple" color="#eab308" />
      </View>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.colHeader, { flex: 1 }]}>ID</Text>
        <Text style={[styles.colHeader, { flex: 2 }]}>Date</Text>
        <Text style={[styles.colHeader, { flex: 2 }]}>Cashier</Text>
        <Text style={[styles.colHeader, { flex: 2, textAlign: 'right' }]}>Total</Text>
      </View>
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransaction}
        ListEmptyComponent={<Text style={styles.empty}>No transactions yet.</Text>}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, borderLeftWidth: 4, elevation: 2, alignItems: 'center' },
  cardLabel: { fontSize: 14, color: '#666', marginTop: 8 },
  cardValue: { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  tableHeader: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ddd', backgroundColor: '#f3f4f6' },
  colHeader: { fontWeight: '600', fontSize: 14 },
  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  colId: { flex: 1, fontSize: 14 },
  colDate: { flex: 2, fontSize: 14 },
  colName: { flex: 2, fontSize: 14 },
  colAmount: { flex: 2, fontSize: 14, textAlign: 'right' },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
});

export default DashboardScreen;
