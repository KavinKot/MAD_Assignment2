import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export default function ListScreen({ route, navigation }) {
  // Get the category name passed from the previous screen
  const { categoryName } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products only for the selected category
    fetch(`https://fakestoreapi.com/products/category/${categoryName}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [categoryName]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Makes it look like a store grid
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            // THE FIX: Passing the whole 'item' as 'product'
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  card: { flex: 1, margin: 5, padding: 15, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  image: { width: 100, height: 100, marginBottom: 10 },
  title: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  price: { fontSize: 16, color: '#e53935', fontWeight: 'bold' }
});