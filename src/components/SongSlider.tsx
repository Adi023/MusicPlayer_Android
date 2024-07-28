import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import TrackPlayer, {useProgress} from 'react-native-track-player'

const SongSlider = () =>  {
    const {position, duration} = useProgress()
    const handleSlidingComplete = async (value: number) => {
        await TrackPlayer.seekTo(value);
    };
    const [sliderValue, setSliderValue] = useState(0);
    useEffect(() => {
        setSliderValue(position);
    }, [position]);
  return (
    <View>
        <Slider
        value={sliderValue}
        minimumValue={0}
        maximumValue={duration}
        onSlidingComplete={handleSlidingComplete}
                onValueChange={(value) => setSliderValue(value)}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                thumbTintColor="#FFFFFF"
        style={styles.sliderContainer}
        />
        <View style={styles.timeContainer}>
            <Text style={styles.time}>
                {new Date(position*1000).toISOString().substring(15, 19)}
            </Text>
            <Text style={styles.time}>
                {new Date((duration-position)*1000).toISOString().substring(15, 19)}
            </Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    sliderContainer: {
      width: 350,
      height: 40,
      marginTop: 25,
  
      flexDirection: 'row',
    },
    timeContainer: {
      width: 340,
  
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    time: {
      color: '#fff',
    },
  });

export default SongSlider