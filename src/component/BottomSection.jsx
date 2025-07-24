import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { horizontalScale, verticalScale, moderateScale } from '../utils/responsive'
import live_chat from '../../assets/live_chat.png'
import talk_to_us from '../../assets/talk_to_us.png'
import logo from '../../assets/logo.png'
import { handleCallPress } from './Commonfunction'
const BottomSection = () => {
  return (
    <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
        marginBottom: verticalScale(12),
        paddingHorizontal: horizontalScale(8),
    }}>
        {/* Left Part: Live Chat & Talk to Us */}
        <View style={{
            flexDirection: 'row',
            width: '50%',
            height: '100%',
            justifyContent: 'space-around',
            alignItems: 'center'
        }}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={live_chat}
                    style={{
                        width: horizontalScale(44),
                        height: verticalScale(44),
                        marginBottom: verticalScale(4)
                    }}
                />
                <Text style={{ fontSize: moderateScale(12), color: 'black' }}>Live Chat</Text>
            </View>
            <TouchableOpacity onPress={handleCallPress}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={talk_to_us}
                    style={{
                        width: horizontalScale(44),
                        height: verticalScale(40),
                        marginBottom: verticalScale(4)
                    }}
                />
                <Text style={{ fontSize: moderateScale(12), color: 'black' }}>Talk to Us</Text>
            </View>
            </TouchableOpacity>
        </View>

        {/* Right Part: Logo */}
        <View style={{
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Image
                source={logo}
                style={{
                    width: horizontalScale(90),
                    height: verticalScale(40),
                    resizeMode: 'contain'
                }}
            />
        </View>
    </View>
  )
}

export default BottomSection