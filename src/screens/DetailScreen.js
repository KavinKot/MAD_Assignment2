import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice'; 

const DetailScreen = ({ route }) => {
  // 1. THE FIX: Safely grab the data no matter what ListScreen called it
  const product = route.params?.product || route.params?.item || route.params; 
  
  const dispatch = useDispatch();

  // 2. THE SAFETY NET: If the data hasn't loaded yet, show this instead of crashing
  if (!product || !product.image) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.title}>Loading product details...</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    alert('Added to My Shopping Cart!');
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price ? product.price.toFixed(2) : '0.00'}</Text>
      <Text style={styles.description}>{product.description}</Text>
      
      <Button title="Add to My Shopping Cart" onPress={handleAddToCart} color="tomato" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  image: { width: 200, height: 200, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  price: { fontSize: 18, color: 'green', marginBottom: 10 },
  description: { textAlign: 'center', color: 'gray', marginBottom: 20 }
});

export default DetailScreen;