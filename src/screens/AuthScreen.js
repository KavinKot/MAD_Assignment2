import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleClear = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Validation Error', 'Please fill out all required fields.');
      return;
    }

    const SERVER_URL = 'http://172.16.11.242:3000';
    const endpoint = isLogin ? '/users/signin' : '/users/signup';

    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isLogin
            ? { email: email, password: password }
            : { name: name, email: email, password: password }
        ),
      });

      const textResponse = await response.text();
      
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        Alert.alert('Server Error', 'Invalid response from server.');
        return;
      }

      console.log("\n=== LOGIN SERVER RESPONSE ===");
      console.log(data);
      console.log("=============================\n");

      if (!response.ok || data.status === 'error') {
        Alert.alert('Authentication Failed', data.message || 'Please try again.');
        return;
      }

      
      const actualToken = data.token || (data.data && data.data.token) || null;

      if (!actualToken) {
        Alert.alert('Missing Token', 'The server logged you in but did not send a token!');
        return;
      }

      dispatch(loginSuccess({
        user: { id: data.id, name: data.name || name, email: data.email || email },
        token: actualToken 
      }));

    } catch (error) {
      Alert.alert('Network Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formCard}>
        <Text style={styles.title}>
          {isLogin ? 'Sign in with email and password' : 'Sign up a new user'}
        </Text>

        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>User Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} autoCapitalize="words" />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry={true} />
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.btnWidth}>
            <Button title="Clear" color="#d9534f" onPress={handleClear} />
          </View>
          <View style={styles.btnWidth}>
            <Button title={isLogin ? "Sign In" : "Sign Up"} color="#5bc0de" onPress={handleAuth} />
          </View>
        </View>

        <TouchableOpacity onPress={() => { setIsLogin(!isLogin); handleClear(); }} style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isLogin ? 'Switch to: sign up a new user' : 'Switch to: sign in with an existing user'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  formCard: { backgroundColor: '#4b42a8', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  inputContainer: { marginBottom: 15 },
  label: { color: '#ddd', marginBottom: 5, fontSize: 14 },
  input: { backgroundColor: '#e8eaf6', borderRadius: 5, padding: 10, fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 20 },
  btnWidth: { width: '40%' },
  toggleContainer: { alignItems: 'center' },
  toggleText: { color: '#fff', textDecorationLine: 'underline', fontSize: 14 }
});

export default AuthScreen;