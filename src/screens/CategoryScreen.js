import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    
    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(json => {
        setCategories(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch categories", err);
        
        setCategories(["electronics", "jewelery", "men's clothing", "women's clothing"]);
        setLoading(false);
      });
  }, []);

  
  const getCategoryUI = (category) => {
    switch (category) {
      case 'electronics': 
        return { icon: 'hardware-chip-outline', color: '#4b42a8', bg: '#e8eaf6', label: 'Electronics' };
      case 'jewelery': 
        return { icon: 'diamond-outline', color: '#f0ad4e', bg: '#fef6e9', label: 'Jewelry' };
      case "men's clothing": 
        return { icon: 'shirt-outline', color: '#5bc0de', bg: '#eef9fb', label: "Men's Clothing" };
      case "women's clothing": 
        return { icon: 'rose-outline', color: '#d9534f', bg: '#fbeaea', label: "Women's Clothing" };
      default: 
        return { icon: 'grid-outline', color: '#333', bg: '#eee', label: category.toUpperCase() };
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4b42a8" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'Shopper'}!</Text>
            <Text style={styles.subtitle}>What are you looking for today?</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="person-circle" size={45} color="#4b42a8" />
          </View>
        </View>

        
        <View style={styles.banner}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Spring Sale</Text>
            <Text style={styles.bannerSub}>Up to 50% off on all clothing.</Text>
          </View>
          <Ionicons name="pricetags" size={50} color="rgba(255,255,255,0.8)" style={styles.bannerIcon} />
        </View>

        <Text style={styles.sectionTitle}>Shop by Category</Text>

        
        <View style={styles.grid}>
          {categories.map((cat, index) => {
            const ui = getCategoryUI(cat);
            return (
              <TouchableOpacity 
                key={index} 
                style={styles.card}
                
                onPress={() => navigation.navigate('ProductList', { category: cat })} 
              >
                <View style={[styles.iconCircle, { backgroundColor: ui.bg }]}>
                  <Ionicons name={ui.icon} size={36} color={ui.color} />
                </View>
                <Text style={styles.cardTitle}>{ui.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f7' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 15, color: '#777' },
  headerIcon: { shadowColor: '#4b42a8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
  
  
  banner: { backgroundColor: '#4b42a8', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  bannerIcon: { position: 'absolute', right: 20, bottom: -10, transform: [{ rotate: '-15deg' }] },
  
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: 'white', width: (width - 55) / 2, borderRadius: 16, paddingVertical: 25, paddingHorizontal: 15, alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  iconCircle: { width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' }
});

export default CategoryScreen;