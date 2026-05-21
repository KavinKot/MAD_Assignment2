import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { removeFromCart, increaseQuantity, decreaseQuantity, clearCart } from '../redux/cartSlice';

const CartScreen = ({ navigation }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const SERVER_URL = 'http://172.16.11.242:3000';

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Add some items first!');
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/orders/neworder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems,
          total: totalAmount
        })
      });

      const data = await response.json();

      if (response.ok && data.status !== 'error') {
        Alert.alert('Success', 'Order placed successfully!');
        dispatch(clearCart()); 
        navigation.navigate('My Orders');
      } else {
        Alert.alert('Server Error', data.message || 'Failed to place order.');
      }
    } catch (error) {
      Alert.alert('Network Error', error.message);
    }
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Looks like you haven't added anything yet.</Text>
      <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Shop')}>
        <Text style={styles.shopBtnText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      
      
      {cartItems.length > 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.itemCountText}>{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</Text>
          <TouchableOpacity style={styles.clearBtn} onPress={() => dispatch(clearCart())}>
            <Ionicons name="trash-outline" size={16} color="#d9534f" />
            <Text style={styles.clearBtnText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>
      )}

      
      <FlatList 
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={cartItems.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
        ListEmptyComponent={renderEmptyCart}
        renderItem={({ item }) => (
          <View style={styles.cartCard}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            </View>
            
            <View style={styles.details}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
              
              <View style={styles.actionRow}>
                <View style={styles.quantityPill}>
                  <TouchableOpacity onPress={() => dispatch(decreaseQuantity(item.id))} style={styles.qtyBtn}>
                    <Ionicons name="remove" size={18} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => dispatch(increaseQuantity(item.id))} style={styles.qtyBtn}>
                    <Ionicons name="add" size={18} color="#333" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))} style={styles.deleteBtn}>
                  <Ionicons name="trash" size={20} color="#d9534f" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      
      {cartItems.length > 0 && (
        <View style={styles.premiumFooter}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.checkoutBtn, cartItems.length === 0 && styles.checkoutBtnDisabled]} 
            onPress={handleCheckout} 
            disabled={cartItems.length === 0}
          >
            <Text style={styles.checkoutBtnText}>Check Out Securely</Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
  itemCountText: { fontSize: 16, fontWeight: '600', color: '#555' },
  clearBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fdeeea', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  clearBtnText: { color: '#d9534f', fontWeight: 'bold', marginLeft: 4, fontSize: 13 },

  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 5 },
  emptySubtitle: { fontSize: 15, color: '#777', textAlign: 'center', marginBottom: 25 },
  shopBtn: { backgroundColor: '#4b42a8', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  shopBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  
  cartCard: { flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 15, marginBottom: 15, borderRadius: 16, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  imageContainer: { width: 80, height: 80, backgroundColor: '#f9f9f9', borderRadius: 12, padding: 5, marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  details: { flex: 1, justifyContent: 'space-between' },
  title: { fontWeight: '600', fontSize: 14, color: '#333', marginBottom: 4 },
  price: { color: '#4b42a8', fontWeight: 'bold', fontSize: 16 },
  
  
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  quantityPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f7', borderRadius: 20, paddingHorizontal: 5, paddingVertical: 2 },
  qtyBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  quantity: { fontSize: 15, fontWeight: 'bold', marginHorizontal: 10, color: '#333' },
  deleteBtn: { padding: 8, backgroundColor: '#fdeeea', borderRadius: 12 },

  
  premiumFooter: { backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 35, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalLabel: { fontSize: 16, color: '#666', fontWeight: '500' },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  checkoutBtn: { flexDirection: 'row', backgroundColor: '#4b42a8', paddingVertical: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  checkoutBtnDisabled: { backgroundColor: '#a39fcd' },
  checkoutBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default CartScreen;