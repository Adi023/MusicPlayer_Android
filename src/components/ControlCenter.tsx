import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ControlCenter = () => {
    const playBackState = usePlaybackState();

    // Next button
    const skipToNext = async () => {
        await TrackPlayer.skipToNext();
    };

    // Previous button
    const skipToPrevious = async () => {
        await TrackPlayer.skipToPrevious();
    };

    const togglePlayback = async (playback: State) => {
        const currentTrack = await TrackPlayer.getActiveTrack();
        if (currentTrack !== null) {
            if (playback === State.Paused || playback === State.Ready) {
                await TrackPlayer.play();
            } else {
                await TrackPlayer.pause();
            }
        }
    };

    const jumpForward = async (seconds: number) => {
        const currentPosition = await TrackPlayer.getPosition();
        await TrackPlayer.seekTo(currentPosition + seconds);
    };

    const jumpBackward = async (seconds: number) => {
        const currentPosition = await TrackPlayer.getPosition();
        await TrackPlayer.seekTo(Math.max(currentPosition - seconds, 0)); // Ensure it doesn't seek to a negative position
    };

    const isPlaybackState = (state: any): state is State => {
        return Object.values(State).includes(state);
    };

    return (
        <View style={styles.container}>
        <Pressable onPress={() => jumpBackward(10)}>
            <Icon style={styles.icon} name="fast-rewind" size={40} />
        </Pressable>
        <Pressable onPress={skipToPrevious}>
            <Icon style={styles.icon} name="skip-previous" size={40} />
        </Pressable>
        <Pressable onPress={() => {
                if (isPlaybackState(playBackState.state)) {
                    togglePlayback(playBackState.state);
                }
            }}>
                <Icon
                    style={styles.icon}
                    name={isPlaybackState(playBackState.state) && playBackState.state === State.Playing ? "pause" : "play-arrow"}
                    size={75}
                />
            </Pressable>
        <Pressable onPress={skipToNext}>
            <Icon style={styles.icon} name="skip-next" size={40} />
        </Pressable>
        <Pressable onPress={() => jumpForward(10)}>
            <Icon style={styles.icon} name="fast-forward" size={40} />
        </Pressable>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 56,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        color: '#FFFFFF',
    },
    playButton: {
        marginHorizontal: 24,
    },
});

export default ControlCenter;
