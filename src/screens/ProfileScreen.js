import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { logout, loginSuccess } from '../redux/authSlice';

const ProfileScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign Out', 
        style: 'destructive', 
        onPress: () => dispatch(logout()) 
      }
    ]);
  };

  const handleSaveChanges = async () => {
    if (!newName.trim() || !newPassword.trim()) {
      Alert.alert('Error', 'Please provide a name and a new password to update.');
      return;
    }

    const SERVER_URL = 'http://172.16.11.242:3000';

    try {
      const response = await fetch(`${SERVER_URL}/users/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newName,
          password: newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.status !== 'error') {
        
        dispatch(loginSuccess({
          user: { ...user, name: newName },
          token: token 
        }));
        
        setModalVisible(false);
        setNewPassword(''); 
        Alert.alert('Success', 'Your profile has been updated!');
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile.');
      }
    } catch (error) {
      Alert.alert('Network Error', error.message);
    }
  };

  const renderSettingRow = (icon, title, onPress, isDestructive = false) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={[styles.iconContainer, isDestructive && styles.destructiveIconContainer]}>
        <Ionicons name={icon} size={20} color={isDestructive ? '#d9534f' : '#4b42a8'} />
      </View>
      <Text style={[styles.rowText, isDestructive && styles.destructiveText]}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=4b42a8&color=fff&size=150` }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.name || 'Test User'}</Text>
          <Text style={styles.email}>{user?.email || 'test@test.com'}</Text>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionBody}>
            {renderSettingRow('person-outline', 'Update Profile', () => setModalVisible(true))}
            <View style={styles.separator} />
            {renderSettingRow('lock-closed-outline', 'Change Password', () => setModalVisible(true))}
            <View style={styles.separator} />
            {renderSettingRow('notifications-outline', 'Notifications', () => Alert.alert('Coming Soon', 'Notification settings will be available in V2.'))}
          </View>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionBody}>
            {renderSettingRow('color-palette-outline', 'Appearance', () => Alert.alert('Coming Soon', 'Dark mode toggle will be available in V2.'))}
            <View style={styles.separator} />
            {renderSettingRow('help-circle-outline', 'Help & Support', () => Alert.alert('Coming Soon', 'Support portal connecting...'))}
          </View>
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.sectionBody}>
            {renderSettingRow('log-out-outline', 'Sign Out', handleSignOut, true)}
          </View>
        </View>

        <Text style={styles.versionText}>Fake Store App v1.0.0</Text>
      </ScrollView>

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#c7c7cc" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Display Name</Text>
            <TextInput 
              style={styles.input} 
              value={newName} 
              onChangeText={setNewName} 
              autoCapitalize="words"
            />

            <Text style={styles.label}>New Password</Text>
            <TextInput 
              style={styles.input} 
              value={newPassword} 
              onChangeText={setNewPassword} 
              secureTextEntry={true}
              placeholder="Enter a new password"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveChanges}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  scrollContent: { paddingBottom: 40 },
  header: { alignItems: 'center', paddingVertical: 30, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#e5e5ea', marginBottom: 20 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editAvatarBtn: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#4b42a8', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'white' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  email: { fontSize: 16, color: '#666' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#8e8e93', textTransform: 'uppercase', marginLeft: 20, marginBottom: 8 },
  sectionBody: { backgroundColor: 'white', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e5e5ea' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 },
  iconContainer: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#e8eaf6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  destructiveIconContainer: { backgroundColor: '#fdeeea' },
  rowText: { flex: 1, fontSize: 16, color: '#333' },
  destructiveText: { color: '#d9534f', fontWeight: '500' },
  separator: { height: 1, backgroundColor: '#e5e5ea', marginLeft: 65 },
  versionText: { textAlign: 'center', color: '#c7c7cc', marginTop: 10, fontSize: 12 },
  
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25, paddingBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  label: { fontSize: 14, color: '#555', marginBottom: 5, fontWeight: '500' },
  input: { backgroundColor: '#f5f5f7', borderRadius: 8, padding: 15, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e5e5ea' },
  saveBtn: { backgroundColor: '#4b42a8', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default ProfileScreen;