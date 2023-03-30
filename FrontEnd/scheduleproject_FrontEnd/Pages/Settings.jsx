import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import React, { useEffect, useState } from 'react';
import SegmentedControlTab from "react-native-segmented-control-tab";
import Header from '../Components/Header';
import { Card, lightColors } from '@rneui/base';
import Icon from 'react-native-vector-icons/Ionicons';
import { Switch } from '@rneui/themed';

export default function Settings() {
    const [checked, setChecked] = useState(false);
    const toggleSwitch = () => {
        setChecked(!checked);
    };

    const [selectedTab, setSelectedTab] = useState(0);
    const handleIndexChange = (tab) => {
        setSelectedTab(tab);
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>

                <View style={styles.container}>

                    <Header></Header>
                    <SegmentedControlTab
                        tabsContainerStyle={{ margin: 20, marginBottom: 40, marginTop: 20, width: 400, height: 45, alignSelf: 'center' }}
                        activeTabStyle={{ backgroundColor: '#00BFFF' }}
                        values={["Shifts", "Constraints"]}
                        selectedIndex={selectedTab}
                        onTabPress={handleIndexChange}
                    />
                    {selectedTab === 0 &&
                        <View >
                            <View style={{ flexDirection: 'row',marginBottom:20 }}>
                                <Icon name="time" size={40} color="black" style={{ marginLeft: 100 }} />
                                <Icon name="person" size={40} color="black" style={{ marginLeft: 75 }} />
                            </View>
                            <Card containerStyle={styles.Shiftscard}>
                                <View style={{ flexDirection: 'row', height: '100%' }}>
                                    <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: 5 }}>09:00-15:00</Text>
                                    <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: 5, marginLeft: 50 }}>1</Text>
                                    <TouchableOpacity>
                                        <Icon type='font-awesome' name="create" size={35} color="black" style={{ marginLeft: 75 }} />
                                    </TouchableOpacity>
                                </View>
                            </Card>


                            <View style={{ backgroundColor: 'black', width: '80%', height: 1, alignSelf: 'center', marginTop: 30, marginBottom: 30 }} />

                        </View>
                    }

                    {selectedTab === 1 &&
                        <View >
                            {/* borderRadius: 10, height: 120, backgroundColor:'#E2F8F9' */}
                            <Card containerStyle={styles.Constraintscard}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ height: '100%' }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>No double shifts</Text>
                                        <Text style={{ fontSize: 15, marginTop: 5, width: 250 }}>worker cannot work two shifts at the same day.</Text>
                                    </View>

                                    <Switch
                                        style={{ marginLeft: 50, marginTop: 25 }}
                                        value={true}
                                        disabled={true}
                                    />

                                </View>
                            </Card>


                            <View style={{ backgroundColor: 'black', width: '80%', height: 1, alignSelf: 'center', marginTop: 30, marginBottom: 30 }} />

                        </View>
                    }

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    Constraintscard: {
        backgroundColor: '#E2F8F9',
        borderRadius: 10,
        marginBottom: 20,
        width: '90%',
        height: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    Shiftscard:{
        backgroundColor: '#E2F8F9',
        borderRadius: 10,
        marginBottom: 20,
        width: '90%',
        height: 70,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    }
});