import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getProducts } from '../services/dummyJsonApi';

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      setError('');
      const data = await getProducts();
      setProducts(data.products ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function handleRefresh() {
    setRefreshing(true);
    loadProducts();
  }

  function openProduct(productId) {
    navigation.navigate('ProductDetails', { productId });
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#116149" />
        <Text style={styles.helperText}>Carregando produtos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Ops, algo deu errado.</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadProducts}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Catalogo DummyJSON</Text>
            <Text style={styles.subtitle}>
              Toque em um produto para buscar os detalhes na API.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed ? styles.cardPressed : null,
            ]}
            onPress={() => openProduct(item.id)}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.cardBody}>
              <Text numberOfLines={2} style={styles.productName}>
                {item.title}
              </Text>
              <Text numberOfLines={2} style={styles.description}>
                {item.description}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.price}>US$ {item.price}</Text>
                <Text style={styles.rating}>Nota {item.rating}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f4f6f8',
  },
  helperText: {
    marginTop: 12,
    color: '#566573',
    fontSize: 15,
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    color: '#17202a',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 6,
    color: '#566573',
    fontSize: 15,
    lineHeight: 21,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 132,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dfe5e8',
    backgroundColor: '#ffffff',
  },
  cardPressed: {
    opacity: 0.74,
    transform: [{ scale: 0.99 }],
  },
  thumbnail: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    color: '#17202a',
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    marginTop: 5,
    color: '#6b7780',
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
  },
  price: {
    color: '#116149',
    fontSize: 16,
    fontWeight: '800',
  },
  rating: {
    color: '#34495e',
    fontSize: 13,
    fontWeight: '700',
  },
  errorTitle: {
    color: '#922b21',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 8,
    color: '#566573',
    fontSize: 15,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 18,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#116149',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
