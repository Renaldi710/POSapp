import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { transactionService } from '../services/transactions';

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionService.getAll()
      .then(data => setTransactions(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.colId}>#{item.id}</Text>
            <Text style={styles.colDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            <Text style={styles.colCashier}>{item.user?.name}</Text>
            <Text style={styles.colTotal}>${Number(item.total_amount).toFixed(2)}</Text>
            <Text style={styles.colStatus}>{item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No transactions found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  colId: { flex: 1, fontSize: 14 },
  colDate: { flex: 2, fontSize: 14 },
  colCashier: { flex: 2, fontSize: 14 },
  colTotal: { flex: 2, fontSize: 14, textAlign: 'right' },
  colStatus: { flex: 1, fontSize: 14, textTransform: 'capitalize', textAlign: 'center' },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
});

export default TransactionsScreen;
