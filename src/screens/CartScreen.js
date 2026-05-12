import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, increaseQuantity, decreaseQuantity } from '../redux/cartSlice';

const CartScreen = () => {
  // Read the cart items from the Redux store
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  // Calculate the total price of everything in the cart
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty!!!</Text>
      ) : (
        <>
          <View style={styles.header}>
             <Text style={styles.headerText}>Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</Text>
             <Text style={styles.headerText}>Total Price: ${totalPrice.toFixed(2)}</Text>
          </View>
          
          <FlatList 
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.price}>Price: ${item.price.toFixed(2)}</Text>
                  
                  {/* --- THE +/- BUTTON ROW --- */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Button title=" - " onPress={() => dispatch(decreaseQuantity(item.id))} />
                    
                    <Text style={{ marginHorizontal: 15, fontSize: 16, fontWeight: 'bold' }}>
                      {item.quantity}
                    </Text>
                    
                    <Button title=" + " onPress={() => dispatch(increaseQuantity(item.id))} />
                  </View>
                </View>
                
                <Button 
                  title="Remove" 
                  color="red" 
                  onPress={() => dispatch(removeFromCart(item.id))} 
                />
              </View>
            )}
          />
          
          <View style={styles.footer}>
            <View style={styles.buttonRow}>
              <Button title="Clear Cart" color="gray" onPress={() => dispatch(clearCart())} />
              <Button title="Check Out" color="#007bff" onPress={() => alert('Checkout coming in Final Submission!')} />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  emptyText: { fontSize: 20, textAlign: 'center', marginTop: '50%', color: '#333' },
  header: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#5bc0de', padding: 15, margin: 10, borderRadius: 5 },
  headerText: { fontWeight: 'bold', fontSize: 16 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 10, marginBottom: 10, padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 5 },
  itemInfo: { flex: 1, marginRight: 10 },
  title: { fontSize: 14, color: '#333' },
  price: { fontSize: 14, color: '#666', marginTop: 5 },
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around' }
});

export default CartScreen;