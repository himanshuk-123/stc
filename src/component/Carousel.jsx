import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import ApiService, { IMAGE_BASE_URL } from '../services/authService';

const CarouselComponent = ({ width, height }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const response = await ApiService.slider(); 
        if (response.data.MESSAGE === 'SUCCESS') {
          const imageList = response.data.AppSilderlist.map(item => ({
            image: item.ImageUrl,
            title: item.Title,
          }));
          setImages(imageList);
        } else {
          alert('Failed to load slider: Unexpected response');
          console.log("Error: ", response.error);
        }
      } catch (err) {
        console.error('Slider error:', err);
        alert('Failed to load slider');
      } finally {
        setLoading(false);
      }
    };

    fetchSliderData();

    // ✅ Listen for screen orientation or dimension change
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => {
      subscription?.remove?.(); // For RN >= 0.65
    };
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <View style={styles.container}>
      <Carousel
        width={screenWidth - 40}
        height={height || 150}
        autoPlay
        autoPlayInterval={3000}
        data={images}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <Image
            source={{ uri: IMAGE_BASE_URL + item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        pagingEnabled
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});

export default CarouselComponent;
