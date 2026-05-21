import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { addToCart } from '../redux/cartSlice';

const { width } = Dimensions.get('window');

const ListScreen = ({ route, navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  
  const category = route.params?.category;

  useEffect(() => {
    
    const url = category 
      ? `https://fakestoreapi.com/products/category/${category}`
      : 'https://fakestoreapi.com/products';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [category]);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      </View>
      
      <View style={styles.cardBottom}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={(e) => {
              e.stopPropagation(); 
              handleAddToCart(item);
            }}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b42a8" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {category ? category.toUpperCase() : 'ALL PRODUCTS'}
        </Text>
        <Text style={styles.itemCount}>{products.length} Items</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f7' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  
  
  header: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', letterSpacing: 0.5 },
  itemCount: { fontSize: 14, color: '#888', fontWeight: '500' },

  
  listContent: { paddingHorizontal: 15, paddingBottom: 30 },
  row: { justifyContent: 'space-between' },

  
  productCard: { backgroundColor: 'white', width: (width - 45) / 2, borderRadius: 16, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, overflow: 'hidden' },
  imageContainer: { width: '100%', height: 150, backgroundColor: 'white', padding: 15, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#f0f0f0' },
  image: { width: '100%', height: '100%' },
  
  cardBottom: { padding: 12, flex: 1, justifyContent: 'space-between' },
  title: { fontSize: 13, color: '#444', fontWeight: '500', marginBottom: 10, lineHeight: 18 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#4b42a8' },
  
  addBtn: { backgroundColor: '#4b42a8', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }
});

export default ListScreen;