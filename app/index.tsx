import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Index() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const router = useRouter();


  const togglePicker = () => {
    setShowPicker((prev) => !prev);
  };

  const formatDate = (dateObj: Date) => {
    return dateObj.toLocaleDateString('en-CA');
  };

  const navigateToResults = (selectedDate: Date) => {
    const formatted = formatDate(selectedDate);
    router.push(`/results?date=${formatted}`);
  };

  const onChange = (event: any, selectedDate?: Date) => {
      if (event.type === 'set' && selectedDate) {
        setDate(selectedDate);
        navigateToResults(selectedDate);
      setShowPicker(false);
    } else{
      togglePicker();
    }
  };

  const confirmIOSDate = () => {
    setDate(date);
    setShowPicker(false);
    navigateToResults(date);
  };

  const cancelIOSDate = () => {
    setShowPicker(false);
  };

  return (
    <View className="flex-1 justify-center px-6">

    <Text className="text-2xl font-bold text-black mb-2 text-center">
      Near Earth Objects(NEO) Monitoring Application
    </Text>
    <Text className="text-base text-gray-700 mb-6 text-center">
      Enter a date to monitor Near-Earth Objects based on their close approach to Earth.
    </Text>

    <Text className="text-lg font-semibold mb-4 text-black">
      Select Date
    </Text>

      <TouchableOpacity  onPress={togglePicker}>
        <Text className="text-base text-black mb-4 border border-gray-300 px-4 py-2 rounded-md text-center">
          {formatDate(date)}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          mode="date"
          display='spinner' 
          value={date}
          onChange={onChange}
          minimumDate={new Date(1900, 1, 15)}
          maximumDate={new Date(2200, 12, 12)}
          textColor= 'black'
        />
      )}

      {Platform.OS === 'ios' && showPicker && (
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            onPress={cancelIOSDate}
            className="bg-gray-300 px-5 py-2 rounded-md"
          >
            <Text className="text-base text-black font-medium">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={confirmIOSDate}
            className="bg-blue-200 px-5 py-2 rounded-md"
          >
            <Text className="text-base text-[#075985] font-medium">Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}


