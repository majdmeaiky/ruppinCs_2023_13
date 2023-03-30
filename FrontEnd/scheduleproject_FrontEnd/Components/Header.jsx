import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Header() {
    const navigation = useNavigation();

    return (
        <View>
            <View style={{ flex: 1, flexDirection: 'row', marginTop:10 }}>
                <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Icon name="bars" size={35} style={{ margin: 10, marginTop: 30 }} color="#000" />
   </TouchableOpacity>
                    <Image style={{ width: 300, height: 90, alignSelf:'center',marginLeft:20 }} source={require('../fair-schedule-logo.png')}></Image>
             



            </View>
            <View style={{ backgroundColor: 'black', width: '80%', height: 1, alignSelf: 'center',marginTop:15 }} />
        </View>)
}
