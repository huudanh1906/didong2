// app/product-detail/[slug].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const { slug } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (slug) {
            axios.get(`http://localhost:8000/chi-tiet-san-pham/${slug}`)
                .then(response => {
                    const { product, listproduct } = response.data;
                    setProduct(product);
                    setRelatedProducts(listproduct);
                })
                .catch(error => {
                    console.error("Error fetching product details:", error);
                });
        }
    }, [slug]);

    const handleAddToCart = (productId) => {
        const newItem = {
            id: productId,
            qty: quantity,
            image: product.image,
            price: product.pricesale > 0 ? product.pricesale : product.price,
            name: product.name,
        };

        // Load existing cart from session storage
        const storedCart = JSON.parse(sessionStorage.getItem('cart') || '[]');

        const existingItem = storedCart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.qty += quantity; // Increase quantity if already in cart
        } else {
            storedCart.push(newItem); // Add new item to cart
        }

        // Save updated cart to session storage
        sessionStorage.setItem('cart', JSON.stringify(storedCart));

        console.log(`Added product with ID: ${productId} to cart with quantity: ${quantity}`);
    };


    if (!product) {
        return (
            <View style={styles.container}>
                <Text>Loading product details...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Product Details Section */}
            <View style={styles.productContainer}>
                <Image source={{ uri: `http://localhost:8000/imgs/products/${product.image}` }} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <View style={styles.priceContainer}>
                        {product.pricesale ? (
                            <>
                                <Text style={styles.priceSale}>{product.pricesale} đ</Text>
                                <Text style={styles.priceOriginal}>{product.price} đ</Text>
                            </>
                        ) : (
                            <Text style={styles.priceSale}>{product.price} đ</Text>
                        )}
                    </View>
                    <Text style={styles.description}>{product.description}</Text>
                    <Text style={styles.detail}>{product.detail}</Text>
                    <TextInput
                        style={styles.quantityInput}
                        value={String(quantity)}
                        keyboardType="numeric"
                        onChangeText={(value) => setQuantity(Number(value))}
                    />
                    <Button title="Add to Cart" onPress={() => handleAddToCart(product.id)} />
                </View>
            </View>

            {/* Related Products Section */}
            {/* <View style={styles.relatedProductsContainer}>
                <Text style={styles.relatedProductsTitle}>Related Products</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {relatedProducts.map((relatedProduct) => (
                        <View key={relatedProduct.id} style={styles.relatedProductItem}>
                            <Image
                                source={{ uri: `http://localhost:8000/imgs/products/${relatedProduct.image}` }}
                                style={styles.relatedProductImage}
                            />
                            <Text style={styles.relatedProductName}>{relatedProduct.name}</Text>
                            <Text style={styles.relatedProductPrice}>{relatedProduct.price} đ</Text>
                            <Button title="View" onPress={() => router.push(`/product-detail/${relatedProduct.slug}`)} />
                        </View>
                    ))}
                </ScrollView>
            </View> */}
        </ScrollView>
    );
};

export default ProductDetail;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    productContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    productImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    productDetails: {
        marginLeft: 20,
        flex: 1,
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    priceSale: {
        fontSize: 18,
        color: 'red',
        marginRight: 10,
    },
    priceOriginal: {
        fontSize: 16,
        textDecorationLine: 'line-through',
        color: '#555',
    },
    description: {
        marginVertical: 5,
        fontSize: 14,
    },
    detail: {
        marginVertical: 5,
        fontSize: 12,
        color: '#777',
    },
    quantityInput: {
        width: 60,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        textAlign: 'center',
        marginBottom: 10,
    },
    relatedProductsContainer: {
        marginTop: 20,
    },
    relatedProductsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    relatedProductItem: {
        marginRight: 20,
        alignItems: 'center',
    },
    relatedProductImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    relatedProductName: {
        fontSize: 14,
        marginTop: 5,
    },
    relatedProductPrice: {
        fontSize: 12,
        color: '#555',
    },
});
