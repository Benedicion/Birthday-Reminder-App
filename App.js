
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,TextInput, Button } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';


export default function App() {

    const addNewEvent = async () => {
    try {
      const calendarId = await createCalendar();
      
      const res = await Calendar.createEventAsync(calendarId, {
        endDate: getAppointementDate(startDate),
        startDate: getAppointementDate(startDate),
        title: 'Happy Birthday buddy ' + friendNameText,
      });
      Alert.alert('Event Created!');
    } catch (e) {
      console.log(e);
    }
  };

    useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
    })();
  }, []);

  async function getDefaultCalendarSource() {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const defaultCalendars = calendars.filter(
    (each) => each.source.name === 'Default'
  );
  return defaultCalendars.length
    ? defaultCalendars[0].source
    : calendars[0].source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Expo Calendar' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
  return newCalendarID;
}

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const startDate = selectedStartDate
    ? selectedStartDate.format('YYYY-MM-DD').toString()
    : '';
    const [friendNameText, setFriendNameText] = useState();

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <CalendarPicker onDateChange={setSelectedStartDate} />
      <Text style={styles.dateText}>Birthday: {startDate}</Text>
      <TextInput
        onChangeText={setFriendNameText}
        value={friendNameText}
        placeholder="Enter the name of your friend"
        style={styles.input}
      />
      <Button title={'Add to calendar'} onPress={addNewEvent} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  dateText: {
    margin: 16,
  },
});