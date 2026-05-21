import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { addToCart } from '../redux/cartSlice';

const DetailScreen = ({ route, navigation }) => {
  
  const product = route.params?.product;
  const dispatch = useDispatch();

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#d9534f" />
        <Text style={styles.errorText}>Oops! Product details not found.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    Alert.alert('Added to Cart', `${product.title} is waiting in your cart!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        
        <View style={styles.detailsContainer}>
          
          <View style={styles.topRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category.toUpperCase()}</Text>
            </View>
            <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
          </View>

          <Text style={styles.title}>{product.title}</Text>

          
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              <Ionicons name="star" size={16} color="#f0ad4e" />
              <Ionicons name="star" size={16} color="#f0ad4e" />
              <Ionicons name="star" size={16} color="#f0ad4e" />
              <Ionicons name="star" size={16} color="#f0ad4e" />
              <Ionicons name="star-half" size={16} color="#f0ad4e" />
            </View>
            <Text style={styles.ratingText}>{product.rating?.rate || '4.5'}</Text>
            <Text style={styles.reviewCount}>({product.rating?.count || '120'} Reviews)</Text>
          </View>
          
          <View style={styles.separator} />

          <Text style={styles.descriptionTitle}>Product Description</Text>
          <Text style={styles.description}>{product.description}</Text>
          
        </View>
      </ScrollView>

      
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Ionicons name="cart" size={24} color="white" style={styles.cartIcon} />
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  container: { flex: 1 },
  
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f7' },
  errorText: { fontSize: 18, color: '#333', marginTop: 15, marginBottom: 20 },

  
  imageWrapper: { width: '100%', height: 350, backgroundColor: '#f9f9f9', padding: 20, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  image: { width: '100%', height: '100%' },

  
  detailsContainer: { padding: 25, paddingBottom: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  categoryBadge: { backgroundColor: '#e8eaf6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  categoryText: { color: '#4b42a8', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  price: { fontSize: 26, fontWeight: '900', color: '#4b42a8' },
  
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', lineHeight: 30, marginBottom: 15 },
  
  
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  stars: { flexDirection: 'row', marginRight: 8 },
  ratingText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginRight: 5 },
  reviewCount: { fontSize: 14, color: '#777' },

  separator: { height: 1, backgroundColor: '#eee', marginBottom: 25 },

  
  descriptionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  description: { fontSize: 15, color: '#555', lineHeight: 24, letterSpacing: 0.2 },

  
  bottomBar: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 35, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10 },
  cartButton: { flexDirection: 'row', backgroundColor: '#4b42a8', height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cartIcon: { marginRight: 10 },
  cartButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 }
});

export default DetailScreen;