import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getProductById } from '../services/dummyJsonApi';

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function ProductDetailsScreen({ route }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#116149" />
        <Text style={styles.helperText}>Buscando detalhes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Nao foi possivel abrir o produto.</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadProduct}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.thumbnail }} style={styles.coverImage} />

        <View style={styles.titleBlock}>
          <Text style={styles.brand}>{product.brand ?? product.category}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Preco</Text>
            <Text style={styles.summaryValue}>US$ {product.price}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Nota</Text>
            <Text style={styles.summaryValue}>{product.rating}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Estoque</Text>
            <Text style={styles.summaryValue}>{product.stock}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informacoes</Text>
          <DetailRow label="Categoria" value={product.category} />
          <DetailRow
            label="Desconto"
            value={`${product.discountPercentage}%`}
          />
          <DetailRow label="SKU" value={product.sku ?? 'Nao informado'} />
          <DetailRow
            label="Garantia"
            value={product.warrantyInformation ?? 'Nao informado'}
          />
          <DetailRow
            label="Envio"
            value={product.shippingInformation ?? 'Nao informado'}
          />
        </View>

        {Array.isArray(product.images) && product.images.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Imagens</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gallery}
            >
              {product.images.map((imageUrl) => (
                <Image
                  key={imageUrl}
                  source={{ uri: imageUrl }}
                  style={styles.galleryImage}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  coverImage: {
    width: '100%',
    height: 280,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
  },
  titleBlock: {
    marginTop: 18,
  },
  brand: {
    color: '#116149',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 6,
    color: '#17202a',
    fontSize: 28,
    fontWeight: '800',
  },
  description: {
    marginTop: 10,
    color: '#566573',
    fontSize: 15,
    lineHeight: 22,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  summaryItem: {
    flex: 1,
    minHeight: 74,
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dfe5e8',
    backgroundColor: '#ffffff',
  },
  summaryLabel: {
    color: '#6b7780',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  summaryValue: {
    marginTop: 5,
    color: '#17202a',
    fontSize: 18,
    fontWeight: '800',
  },
  section: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dfe5e8',
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    marginBottom: 8,
    color: '#17202a',
    fontSize: 18,
    fontWeight: '800',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#edf1f3',
  },
  detailLabel: {
    color: '#6b7780',
    fontSize: 14,
    fontWeight: '700',
  },
  detailValue: {
    flex: 1,
    color: '#17202a',
    fontSize: 14,
    textAlign: 'right',
  },
  gallery: {
    gap: 12,
    paddingTop: 4,
  },
  galleryImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
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
