import React, { useEffect, useRef, useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const Slider = () => {
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollViewRef = useRef(null);

    // Fetch banners from the backend
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get('http://localhost:8000/admin/banner'); // Update with your actual endpoint
                setSlides(response.data);
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        fetchBanners();
    }, []);

    // Function to change the slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Auto-run slider
    useEffect(() => {
        const interval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
        return () => clearInterval(interval); // Clear interval on component unmount
    }, [slides.length]);

    // Scroll to the current slide
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: currentSlide * 450, animated: true }); // 450 is the width of each slide
        }
    }, [currentSlide]);

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                ref={scrollViewRef}
            >
                {slides.map((item) => (
                    <View style={styles.slide} key={item.id}>
                        <Image
                            source={{ uri: `http://localhost:8000/imgs/banners/${item.image}` }} // Ensure the URL is correct
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                ))}
            </ScrollView>

            <View style={styles.dotContainer}>
                {slides.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.dot, index === currentSlide && styles.activeDot]}
                        onPress={() => setCurrentSlide(index)}
                    />
                ))}
            </View>

            {/* Next and previous buttons */}
            <TouchableOpacity style={styles.prevButton} onPress={prevSlide}>
                <Text style={styles.buttonText}>{'<'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
                <Text style={styles.buttonText}>{'>'}</Text>
            </TouchableOpacity>

            {/* Right images */}
            <View style={styles.imgRightContainer}>
                <Image
                    source={{ uri: "http://localhost:8000/imgs/sideshow5.jpg" }}
                    style={styles.rightImage}
                    resizeMode="cover"
                />
                <Image
                    source={{ uri: "http://localhost:8000/imgs/sideshow1.jpg" }}
                    style={styles.rightImage}
                    resizeMode="cover"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    slide: {
        width: 450, // Adjust width as needed
        height: 270,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    dotContainer: {
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: [{ translateX: -15 }],
        flexDirection: 'row',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ccc',
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: '#007BFF',
    },
    prevButton: {
        position: 'absolute',
        top: '50%',
        left: 10,
        transform: [{ translateY: -50 }],
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderRadius: 5,
    },
    nextButton: {
        position: 'absolute',
        top: '50%',
        right: 10,
        transform: [{ translateY: -50 }],
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 24,
        color: '#000',
    },
    imgRightContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightImage: {
        width: '100%',
        height: 80,
        marginBottom: 10,
        borderRadius: 10,
    },
});

export default Slider;
