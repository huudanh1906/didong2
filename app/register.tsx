import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker, ImageBackground } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const backgroundImage = require("../assets/images/background.png");

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: '',
        gender: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:8000/register', {
                ...formData,
                gender: formData.gender === '1' ? 1 : 2,  // 1 for Male, 2 for Female
            });
            setSuccess(response.data.message);
            router.push('/'); // Redirect to login after successful registration
        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.message || 'Registration failed. Please check your inputs.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Register</Text>
                {error && <Text style={styles.error}>{error}</Text>}
                {success && <Text style={styles.success}>{success}</Text>}
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={formData.name}
                        onChangeText={(value) => handleChange('name', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={formData.username}
                        onChangeText={(value) => handleChange('username', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={formData.email}
                        onChangeText={(value) => handleChange('email', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={formData.password}
                        onChangeText={(value) => handleChange('password', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        secureTextEntry
                        value={formData.password_confirmation}
                        onChangeText={(value) => handleChange('password_confirmation', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone"
                        value={formData.phone}
                        onChangeText={(value) => handleChange('phone', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        value={formData.address}
                        onChangeText={(value) => handleChange('address', value)}
                    />
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.gender}
                            onValueChange={(value) => handleChange('gender', value)}
                        >
                            <Picker.Item label="Select Gender" value="" />
                            <Picker.Item label="Male" value="1" />
                            <Picker.Item label="Female" value="2" />
                        </Picker>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    input: {
        height: 50,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        overflow: 'hidden',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    success: {
        color: 'green',
        marginBottom: 10,
    },
});

export default Register;
