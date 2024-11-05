import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import ShoppingCartIcon
import Slider from './Slider';

const HomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch categories
    axios.get('http://localhost:8000/category')
      .then(response => {
        console.log("Categories:", response.data); // Log the fetched categories
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });

    // Fetch featured products
    axios.get('http://localhost:8000/admin/product')
      .then(response => {
        console.log("Featured Products:", response.data); // Log the fetched products
        setFeaturedProducts(response.data);
      })
      .catch(error => {
        console.error("Error fetching featured products:", error);
      });
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      axios.get(`http://localhost:8000/tim-kiem?search=${searchQuery}`)
        .then(response => {
          setSearchResults(response.data.data); // Assuming products are in 'data'
          setSearchQuery('');
        })
        .catch(error => {
          console.error("Error searching products:", error);
        });
    } else {
      setSearchResults([]);
    }
  };

  const fetchProductsByCategory = (categorySlug) => {
    if (!categorySlug) {
      console.error('Category slug is undefined');
      return;
    }

    axios.get(`http://localhost:8000/danh-muc/${categorySlug}`)
      .then(response => {
        console.log(`Products for category ${categorySlug}:`, response.data.data); // Log the products data
        setFeaturedProducts(response.data.data || []); // Access the 'data' array here
      })
      .catch(error => {
        console.error(`Error fetching products for category ${categorySlug}:`, error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to the Shop</Text>
        {/* Cart Button */}
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push('/Cart')} // Navigate to Cart.tsx
        >
          <ShoppingCartIcon style={styles.cartIcon} /> {/* Use ShoppingCartIcon */}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      <Slider />

      {/* Categories Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          <TouchableOpacity onPress={() => router.push('/home')}>
            <View style={styles.categoryItem} >
              <Image source={{ uri: `https://static.thenounproject.com/png/145292-200.png` }} style={styles.categoryImage} />
              <Text style={styles.categoryText}>All</Text>
            </View>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} onPress={() => fetchProductsByCategory(category.slug)}>
              <View style={styles.categoryItem}>
                <Image source={{ uri: `http://localhost:8000/imgs/categorys/${category.image}` }} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View >

      {/* Featured Products Section */}
      < View style={styles.section} >
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <View style={styles.productsGrid}>
          {(searchResults.length > 0 ? searchResults : featuredProducts).map((product) => {
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.productItem}
                onPress={() => {
                  console.log(`Navigating to product detail for slug: ${product.slug}`); // Log the slug before navigation
                  router.push(`/product-detail/${product.slug}`); // Navigate to the product detail screen with slug
                }}
              >
                <Image
                  source={{ uri: `http://localhost:8000/imgs/products/${product.image}` }}
                  style={styles.productImage}
                />
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View >
    </ScrollView >
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-between', // Space between header text and cart button
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#4CAF50', // Green background
    padding: 10,
    borderRadius: 5,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 14,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  productItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  productName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
});
