import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

export default function DetailScreen({ route }) {
  // Get the product ID passed from the List Screen
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.category}>{product.category.toUpperCase()}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' },
  image: { width: 250, height: 250, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  category: { fontSize: 14, color: '#888', marginBottom: 10 },
  price: { fontSize: 24, color: '#e53935', fontWeight: 'bold', marginBottom: 20 },
  description: { fontSize: 16, color: '#444', lineHeight: 24, textAlign: 'justify' }
});