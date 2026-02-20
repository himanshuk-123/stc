import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService, { IMAGE_BASE_URL } from '../services/authService';

const SLIDER_CACHE_KEY = 'slider_images_cache_v1';

const CarouselComponent = ({ width, height }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const fetchSliderData = async () => {
      let hasCache = false;

      try {
        const cached = await AsyncStorage.getItem(SLIDER_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setImages(parsed);
            setLoading(false);
            hasCache = true;
          }
        }
      } catch (cacheError) {
        console.error('Slider cache read error:', cacheError);
      }

      try {
        const response = await ApiService.slider(); 
        if (response.data.MESSAGE === 'SUCCESS') {
          const imageList = response.data.AppSilderlist.map(item => ({
            image: item.ImageUrl,
            title: item.Title,
          }));
          setImages(imageList);
          await AsyncStorage.setItem(SLIDER_CACHE_KEY, JSON.stringify(imageList));
        } else {
          console.log("Error: ", response.error);
        }
      } catch (err) {
        console.error('Slider error:', err);
      } finally {
        if (!hasCache) {
          setLoading(false);
        }
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

  if (!images.length) {
    return null;
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
    marginVertical: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});

export default CarouselComponent;
