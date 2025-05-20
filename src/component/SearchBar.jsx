import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'; 

const SearchBar = ({placeholder}) => {
  return (
    <View className="bg-white rounded-full flex-row items-center px-4 mb-4"
            style={{height: 50}}
        >
          <TextInput
            placeholder={placeholder}
            className="flex-1 py-2 text-gray-700 font-bold text-lg"
            placeholderTextColor="#888"
          />
          <Ionicons name="search" size={28} color="#666" />
        </View>
  )
}

export default SearchBar