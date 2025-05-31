import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from '../component/button'
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import UserService from '../services/UserService';
import ReportService from '../services/reportService.js';
const BalanceCheckScreen = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);
    const navigation = useNavigation();

    // const checkBalance = async() => {
    //     try {
    //         // Request location permission
    //         let { status } = await Location.requestForegroundPermissionsAsync();
    //         if (status !== 'granted') {
    //           Alert.alert('Permission Denied', 'Location permission is required');
    //           setLoading(false);
    //           return;
    //         }

    //         // Get current location
    //         let location = await Location.getCurrentPositionAsync({});
    //         const locationStr = `${location.coords.latitude},${location.coords.longitude}`;


    //         // Prepare payload
    //         const payload = {
    //           Tokenid: userData.tokenid,
    //           Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
    //           Location: locationStr,
    //         };

    //         const response = await UserService.BalanceCheck(
    //           payload.Tokenid,
    //           payload.Version,
    //           payload.Location
    //         );
    //         console.log(response.data);
    //     }catch(error){
    //         console.log(error)
    //     }
    // }
    const ComplainList = async () => {
        const payload = {
            Tokenid: userData.tokenid,
            PageIndex: 1,
            PageSize: 20,
            Version: Constants?.expoConfig?.version?.split('.')[0] || '1',
            Location: null,
        }
        console.log(payload)

        try {
            const response = await ReportService.ComplainList(
                payload.Tokenid,
                payload.PageIndex,
                payload.PageSize,
                payload.Version,
                payload.Location
            )
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View>
            <Text>BalanceCheckScreen</Text>
            <View className="mt-6">
                <CustomButton title='Complain List' onPress={ComplainList} />
            </View>
        </View>
    )
}

export default BalanceCheckScreen