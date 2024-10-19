import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from "react-native";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { router, useRouter } from "expo-router";

// Define the type for the address
type Address = {
    street: string;
    buildingName: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
};

// Define the type for the form data
type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    password: string;
    address: Address;
};

const Register = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        password: "",
        address: {
            street: "",
            buildingName: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
        },
    });

    const navigation = useNavigation();

    // The handleChange function for updating form values
    const handleChange = (name: string, value: string) => {
        const [field, subField] = name.split('.');

        if (subField) {
            // Type-safe way to handle nested fields like address
            setFormData(prevFormData => ({
                ...prevFormData,
                [field as keyof FormData]: {
                    ...prevFormData[field as keyof FormData] as Address,
                    [subField as keyof Address]: value,
                },
            }));
        } else {
            // Handling non-nested fields
            setFormData(prevFormData => ({
                ...prevFormData,
                [name as keyof FormData]: value,
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/register", formData, {
                headers: { "Content-Type": "application/json" },
            });

            // Show registration success and navigate manually
            console.log("Registration successful");
            router.navigate('/login'); // Navigate to Login page directly after success
        } catch (error) {
            console.error("Registration failed", error);
            Alert.alert("Error", "Registration failed. Please try again.");
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require('../../assets/images/logoPS.png')}
                style={styles.Logo}
            />
            <Image
                source={require('../../assets/images/controller.jpg')}
                style={styles.reactLogo}
            />
            <Text style={styles.title}>Sign up</Text>
            <Image
                source={require('../../assets/images/controller.jpg')}
                style={styles.reactLogo2}
            />
            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="First name"
                        value={formData.firstName}
                        onChangeText={(text) => handleChange("firstName", text)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Last name"
                        value={formData.lastName}
                        onChangeText={(text) => handleChange("lastName", text)}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => handleChange("email", text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Mobile Phone</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    keyboardType="phone-pad"
                    value={formData.mobileNumber}
                    onChangeText={(text) => handleChange("mobileNumber", text)}
                />
            </View>

            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Street</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Street"
                        value={formData.address.street}
                        onChangeText={(text) => handleChange("address.street", text)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Building Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Building Name"
                        value={formData.address.buildingName}
                        onChangeText={(text) => handleChange("address.buildingName", text)}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="City"
                        value={formData.address.city}
                        onChangeText={(text) => handleChange("address.city", text)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>State</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="State"
                        value={formData.address.state}
                        onChangeText={(text) => handleChange("address.state", text)}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Country</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Country"
                        value={formData.address.country}
                        onChangeText={(text) => handleChange("address.country", text)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pincode</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Pincode"
                        value={formData.address.pincode}
                        onChangeText={(text) => handleChange("address.pincode", text)}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Create password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(text) => handleChange("password", text)}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.navigate('/login')}>
                    <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "center",
    },
    Logo: {
        width: 100,
        height: 100,
        marginLeft: 690,
    },
    reactLogo: {
        width: 30,
        height: 30,
        marginLeft: 660,
        position: 'relative',
        top: 34
    },
    reactLogo2: {
        width: 30,
        height: 30,
        marginLeft: 785,
        position: 'relative',
        top: -50
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    inputContainer: {
        flex: 1,
        marginBottom: 15,
        marginHorizontal: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
    },
    loginContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
    },
    loginLink: {
        fontSize: 16,
        color: '#007BFF',
        marginTop: 8,
    },
});

export default Register;
