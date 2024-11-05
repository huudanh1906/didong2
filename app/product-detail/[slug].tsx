import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
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
                    setRelatedProducts(response.data.listproduct.data.slice(0, 4));
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

        const storedCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
        const existingItem = storedCart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.qty += quantity;
        } else {
            storedCart.push(newItem);
        }
        sessionStorage.setItem('cart', JSON.stringify(storedCart));

        console.log(`Added product with ID: ${productId} to cart with quantity: ${quantity}`);
    };

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
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

                    {/* Quantity Controls */}
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.quantityInput}
                            value={String(quantity)}
                            keyboardType="numeric"
                            editable={false} // Make it read-only
                        />
                        <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={() => {
                            if (quantity > 0) {
                                handleAddToCart(product.id);
                            } else {
                                alert('Quantity must be at least 1.');
                            }
                        }}
                    >
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>

                </View>
            </View>

            {/* Related Products Section */}
            <View style={styles.relatedProductsContainer}>
                <Text style={styles.relatedProductsTitle}>Related Products</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {relatedProducts.map((relatedProduct) => (
                        <TouchableOpacity
                            key={relatedProduct.id}
                            style={styles.relatedProductItem}
                            onPress={() => router.push(`/product-detail/${relatedProduct.slug}`)}
                        >
                            <Image
                                source={{ uri: `http://localhost:8000/imgs/products/${relatedProduct.image}` }}
                                style={styles.relatedProductImage}
                            />
                            <Text style={styles.relatedProductName}>{relatedProduct.name}</Text>
                            <Text style={styles.relatedProductPrice}>{relatedProduct.price} đ</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
};

export default ProductDetail;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    productContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    productImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginLeft: 75,
    },
    productDetails: {
        marginTop: 15,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    priceSale: {
        fontSize: 20,
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
        color: '#666',
    },
    detail: {
        marginVertical: 5,
        fontSize: 12,
        color: '#777',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    quantityInput: {
        width: 60,
        height: 35,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 5,
        fontSize: 14,
        backgroundColor: '#fff',
    },
    quantityButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
    quantityButtonText: {
        fontSize: 18,
        color: '#333',
    },
    addToCartButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
    },
    relatedProductsContainer: {
        marginTop: 20,
    },
    relatedProductsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    relatedProductItem: {
        marginRight: 15,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        width: 120,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    relatedProductImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    relatedProductName: {
        fontSize: 14,
        marginTop: 5,
        color: '#333',
    },
    relatedProductPrice: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
});
