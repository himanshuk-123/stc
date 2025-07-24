import { View, Text, Alert, SafeAreaView, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { horizontalScale, verticalScale } from '../utils/responsive'
import COMMON_SERVICE from '../services/commonServices';
import { useNavigation } from '@react-navigation/native';
import GradientLayout from '../component/GradientLayout';
import Header from '../component/Header';
import { Picker } from '@react-native-picker/picker';
import { PlanService } from '../services/PlanService';
const BrowsePlanStateSelection = ({route}) => {
    const navigation = useNavigation();
    useEffect(() => {   
        const fetchStates = async () => {
          try {
            const response = await PlanService.GetBrowsePlan();
            console.log("response states", response);
            setStates(response.data);
          } catch (error) {
            console.error("Error fetching states:", error);
            Alert.alert("Error", "Unable to load states.");
          }
        };
    
        fetchStates();
      }, []);
    const {opcodenew, mode, operator, number} = route.params;
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState(null);

  useEffect(() => {
    console.log("operator", operator);
}, []);
  const handleSelect = (itemValue) => {
    setSelectedStateId(itemValue);
    navigation.replace('BrowsePlan',{opcodenew: opcodenew?opcodenew:operator.OpTypeId, stateId: itemValue, mode: mode, operator: operator, number: number});
  };
  return (
    <GradientLayout>
        <SafeAreaView style={{flex: 1, paddingHorizontal: horizontalScale(16), paddingTop: verticalScale(16)}}>
            <Header headingTitle={`Select State for ${operator.name?operator.name:operator.Operator}`} />
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedStateId}
        onValueChange={handleSelect}
        dropdownIconColor="#000"
        style={{width: '100%', height: verticalScale(50), color: 'black',backgroundColor: 'white', borderRadius: horizontalScale(10), borderWidth: 1, borderColor: 'gray'}}
      >
        <Picker.Item label="Select State" value={null} />
        {states.map((state) => (
            <Picker.Item 
            key={state.CircleCode}
            label={`${state.Name} (${state.CircleCode})`} 
            value={state.CircleCode} 
             />
        ))}
      </Picker>
    </View>
    </SafeAreaView>
    </GradientLayout>
  )
}

const styles = StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 50,
        overflow: 'hidden',
        marginBottom: 16
    },
})
export default BrowsePlanStateSelection