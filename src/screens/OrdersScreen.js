import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { addToCart } from '../redux/cartSlice';


const locallyCancelledOrderIds = new Set();
const locallyPaidOrderIds = new Set();
const locallyDeliveredOrderIds = new Set();

const OrdersScreen = () => {
  const token = useSelector((state) => state.auth.token);
  
  const user = useSelector((state) => state.auth.user);
  
  const dispatch = useDispatch();
  const SERVER_URL = 'http://172.16.11.242:3000'; 
  
  const [orders, setOrders] = useState({ new: [], paid: [], delivered: [] });
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const cacheBuster = new Date().getTime();
      const response = await fetch(`${SERVER_URL}/orders/all?t=${cacheBuster}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await response.json();
      
      if (response.ok && data.status !== 'error') {
        let ordersList = data.orders || [];
        
        
        if (user && user.id) {
            ordersList = ordersList.filter(o => o.uid === user.id);
        }
        
        
        ordersList = ordersList.filter(o => !locallyCancelledOrderIds.has(o.id));
        
        
        ordersList = ordersList.map(o => {
          let updatedOrder = { ...o };
          if (locallyPaidOrderIds.has(o.id)) {
            updatedOrder.is_paid = 1;
          }
          if (locallyDeliveredOrderIds.has(o.id)) {
            updatedOrder.is_delivered = 1;
          }
          return updatedOrder;
        });
        
        
        const newOrders = ordersList.filter(o => o.is_paid != 1 && o.is_delivered != 1);
        const paidOrders = ordersList.filter(o => o.is_paid == 1 && o.is_delivered != 1);
        const deliveredOrders = ordersList.filter(o => o.is_delivered == 1);
        
        setOrders({ new: newOrders, paid: paidOrders, delivered: deliveredOrders });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      let payload = { id: orderId, status: newStatus };
      if (newStatus === 'paid') {
        payload.is_paid = 1;
      } else if (newStatus === 'delivered') {
        payload.is_delivered = 1;
      }

      const response = await fetch(`${SERVER_URL}/orders/updateorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload) 
      });
      
      const data = await response.json();
      
      if (response.ok && data.status !== 'error') {
        Alert.alert('Success', `Order marked as ${newStatus}!`, [
          { 
            text: 'OK', 
            onPress: () => {
              if (newStatus === 'paid') {
                locallyPaidOrderIds.add(orderId);
              } else if (newStatus === 'delivered') {
                locallyDeliveredOrderIds.add(orderId);
              }
              fetchOrders();
            } 
          }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to update order status.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error.');
    }
  };

  const handleCancelOrder = (orderId) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel it', 
          style: 'destructive',
          onPress: () => {
            locallyCancelledOrderIds.add(orderId);
            fetchOrders();
            Alert.alert('Cancelled', 'Your order has been cancelled.');
          }
        }
      ]
    );
  };

  const handleReorder = (items) => {
    items.forEach(item => {
      const quantity = item.quantity || 1;
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(item));
      }
    });
    Alert.alert('Success', 'Items have been added to your cart!');
  };

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const renderOrderItem = ({ item, statusCategory }) => {
    const isExpanded = expandedOrderId === item.id;
    
    let parsedItems = [];
    try {
      parsedItems = typeof item.order_items === 'string' ? JSON.parse(item.order_items) : (item.order_items || []);
    } catch (e) {
      console.error(e);
    }

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity style={styles.orderHeader} onPress={() => toggleExpand(item.id)}>
          <Text style={styles.boldText}>Order ID: {item.id}</Text>
          <Text>Items: {item.item_numbers || 0}</Text>
          <Text style={styles.boldText}>Total: ${item.total_price != null ? (item.total_price / 100).toFixed(2) : '0.00'}</Text>
          <Ionicons name={isExpanded ? 'caret-up' : 'caret-down'} size={20} color="black" />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            
            {parsedItems.map((prod, index) => (
              <View key={index} style={styles.itemRow}>
                {prod.image ? (
                  <Image source={{ uri: prod.image }} style={styles.itemImage} resizeMode="contain" />
                ) : (
                  <View style={styles.placeholderImage} />
                )}
                <View style={styles.itemDetails}>
                  <Text style={styles.itemText} numberOfLines={2}>{prod.title}</Text>
                  <Text style={styles.itemSubText}>Qty: {prod.quantity || 1}</Text>
                </View>
              </View>
            ))}
            
            <View style={styles.actionButtons}>
              <View style={styles.btnWrapper}>
                <Button title="Reorder" color="#f0ad4e" onPress={() => handleReorder(parsedItems)} />
              </View>
              
              {statusCategory === 'new' && (
                <>
                  <View style={styles.btnWrapper}>
                    <Button title="Cancel" color="#d9534f" onPress={() => handleCancelOrder(item.id)} />
                  </View>
                  <View style={styles.btnWrapper}>
                    <Button title="Pay" color="#4CAF50" onPress={() => handleUpdateStatus(item.id, 'paid')} />
                  </View>
                </>
              )}
              
              {statusCategory === 'paid' && (
                <View style={styles.btnWrapper}>
                  <Button title="Receive" color="#2196F3" onPress={() => handleUpdateStatus(item.id, 'delivered')} />
                </View>
              )}
            </View>

          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>New Orders ({orders.new.length})</Text>
      <FlatList 
        data={orders.new} 
        renderItem={(props) => renderOrderItem({ ...props, statusCategory: 'new' })} 
        keyExtractor={item => item.id.toString()} 
      />

      <Text style={styles.sectionTitle}>Paid Orders ({orders.paid.length})</Text>
      <FlatList 
        data={orders.paid} 
        renderItem={(props) => renderOrderItem({ ...props, statusCategory: 'paid' })} 
        keyExtractor={item => item.id.toString()} 
      />

      <Text style={styles.sectionTitle}>Delivered Orders ({orders.delivered.length})</Text>
      <FlatList 
        data={orders.delivered} 
        renderItem={(props) => renderOrderItem({ ...props, statusCategory: 'delivered' })} 
        keyExtractor={item => item.id.toString()} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', backgroundColor: '#00bcd4', color: 'white', padding: 10, marginVertical: 5, borderRadius: 5 },
  orderCard: { backgroundColor: 'white', padding: 15, marginVertical: 5, borderRadius: 8, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  boldText: { fontWeight: 'bold' },
  expandedContent: { marginTop: 15, borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 },
  
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  itemImage: { width: 40, height: 40, marginRight: 10 },
  placeholderImage: { width: 40, height: 40, marginRight: 10, backgroundColor: '#ddd' },
  itemDetails: { flex: 1 },
  itemText: { fontSize: 14, color: '#333', fontWeight: '500' },
  itemSubText: { fontSize: 12, color: '#777', marginTop: 2 },
  
  actionButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  btnWrapper: { marginLeft: 10 }
});

export default OrdersScreen;