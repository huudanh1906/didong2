// app/Cart.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Image } from 'react-native';
import Toast from 'react-native-toast-message';

const Cart = () => {
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        const storedCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
        setCart(storedCart);
    }, []);

    const handleRemoveFromCart = (id: number) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleIncreaseQuantity = (id: number) => {
        const updatedCart = cart.map(item => {
            if (item.id === id) {
                return { ...item, qty: item.qty + 1 };
            }
            return item;
        });
        setCart(updatedCart);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleDecreaseQuantity = (id: number) => {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.qty > 1) {
                return { ...item, qty: item.qty - 1 };
            }
            return item;
        });
        setCart(updatedCart);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleOrder = () => {
        Toast.show({
            text1: 'Order successfully!',
            position: 'bottom',
            visibilityTime: 3000, // Duration for which the toast is visible
            autoHide: true,
            type: 'success', // You can customize the toast type
        });
        setCart([]); // Reset the cart
        sessionStorage.setItem('cart', JSON.stringify([])); // Clear storage
    };

    const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Your Cart</Text>
            {cart.length === 0 ? (
                <Text style={styles.emptyMessage}>Your cart is empty now.</Text>
            ) : (
                <View>
                    {cart.map((item) => (
                        <View key={item.id} style={styles.cartItem}>
                            <Image source={{ uri: `http://localhost:8000/imgs/products/${item.image}` }} style={styles.cartImage} />
                            <View style={styles.cartDetails}>
                                <Text style={styles.cartProductName}>{item.name}</Text>
                                <Text>Giá: {item.price} đ</Text>
                                <View style={styles.quantityControls}>
                                    <Button title="-" onPress={() => handleDecreaseQuantity(item.id)} />
                                    <Text style={styles.quantityText}>{item.qty}</Text>
                                    <Button title="+" onPress={() => handleIncreaseQuantity(item.id)} />
                                </View>
                                <Text>Total: {item.price * item.qty} đ</Text>
                                <Button title="Xóa" onPress={() => handleRemoveFromCart(item.id)} />
                            </View>
                        </View>
                    ))}
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Cart Total: {totalPrice} đ</Text>
                    </View>
                    <Button title="Order" onPress={handleOrder} color="#4CAF50" />
                </View>
            )}
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </ScrollView>
    );
};

export default Cart;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    emptyMessage: {
        fontSize: 18,
        color: '#555',
    },
    cartItem: {
        flexDirection: 'row',
        marginBottom: 20,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cartImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    cartDetails: {
        marginLeft: 10,
        flex: 1,
    },
    cartProductName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    quantityText: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    totalContainer: {
        marginTop: 20,
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
