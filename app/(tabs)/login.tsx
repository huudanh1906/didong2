import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email,
        password,
      });

      // Navigate to the home tab
      router.navigate('/'); // Use 'navigate' method if available
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Image
          source={require('../../assets/images/logoPS.png')}
          style={styles.Logo}
        />
      <Image
          source={require('../../assets/images/controller.jpg')}
          style={styles.reactLogo}
        />
      <Text style={styles.header}>Login</Text>
      <Image
          source={require('../../assets/images/controller.jpg')}
          style={styles.reactLogo2}
        />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <View style={styles.button}>
        <Button title="Login" onPress={handleLogin} />
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.navigate('/register')}>
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  Logo: {
    width: 100,
    height: 100,
    marginLeft: 695,
  },
  reactLogo: {
    width: 30,
    height: 30,
    marginLeft: 680,
    position: 'relative',
    top: 30
  },
  reactLogo2: {
    width: 30,
    height: 30,
    marginLeft: 790,
    position: 'relative',
    top: -64
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    marginHorizontal: 50,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 20,
    marginHorizontal: 50,
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    fontSize: 16,
    color: '#007BFF',
    marginTop: 8,
  },
});

export default Login;
