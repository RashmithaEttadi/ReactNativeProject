import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { getErrorMessage } from '../utilities/errorUtils';



export default function results() {
  const { date } = useLocalSearchParams();
  type Neo = {
    id: string;
    name: string;
    estimated_diameter: {
      feet: {
        estimated_diameter_max: number;
      };
    };
    is_potentially_hazardous_asteroid: boolean;
    close_approach_data: Array<{
      miss_distance: { miles: number };
      relative_velocity: { miles_per_hour: string };
    }>;
  };

  const [neos, setNeos] = useState<Neo[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = process.env.EXPO_PUBLIC_NASA_API_KEY;


  useEffect(() => {
    if (!date) return;

    const fetchData = async () => {
      try {
        
        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${API_KEY}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        const objectsForDate = json.near_earth_objects[date.toString()];

        setNeos(objectsForDate || []);
        } catch (error) {
          setError(getErrorMessage(error));
        } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  const visibleNeos = neos.slice(0, visibleCount);
  const hasMore = visibleCount < neos.length;

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4 text-black">
        Near Earth Objects on {date}
      </Text>

      <FlatList
        data={visibleNeos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
        const diameterFt = Math.round(item.estimated_diameter.feet.estimated_diameter_max);
        const isHazardous = item.is_potentially_hazardous_asteroid;
        const missDistance = Math.round(item.close_approach_data[0]?.miss_distance?.miles);
        const velocity = item.close_approach_data[0]?.relative_velocity?.miles_per_hour;

        const cardStyle = isHazardous
          ? 'border-red-500 bg-red-100'
          : 'border-green-500 bg-green-100';

        return (
          <Animatable.View
            animation="pulse"
            duration={800}
            delay={index * 100}
            className={`mb-4 p-4 border rounded-xl ${cardStyle}`}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-semibold text-black">
                {item.name}
              </Text>
            {isHazardous ? (
                            <MaterialIcons name="warning" size={28} className="text-red-600" />
                            ) : (
                            <MaterialIcons name="check-circle" size={28} className="text-green-600" />
                            )}
            </View>

            <Text className="text-black">
              Potentially Hazardous: {isHazardous ? 'Yes' : 'No'}
            </Text>
            <Text className="text-black">
              Estimated Diameter: {diameterFt} ft
            </Text>
            <Text className="text-black">
              Miss Distance: {missDistance.toLocaleString()} miles
            </Text>
            <Text className="text-black">
             Relative Velocity: {parseFloat(velocity).toFixed(2).toLocaleString()} mph
            </Text>
          </Animatable.View>
          );
          }}

      />

        {hasMore && (
          <TouchableOpacity
            onPress={loadMore}
            className="bg-blue-600 py-3 px-6 rounded-md self-center mt-4"
          >
          <Text className="text-white font-semibold text-center">Load More</Text>
          </TouchableOpacity>
          )}
        </View>
);
}

