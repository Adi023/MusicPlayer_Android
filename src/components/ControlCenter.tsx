import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import TrackPlayer, { RepeatMode, State, usePlaybackState } from 'react-native-track-player';
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
        await TrackPlayer.seekTo(Math.max(currentPosition - seconds, 0)); 
        // Ensure it doesn't seek to a negative position
    };

    const isPlaybackState = (state: any): state is State => {
        return Object.values(State).includes(state);
    };


    const [isShuffling, setIsShuffling] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [originalQueue, setOriginalQueue] = useState([]);

    const toggleShuffle = async () => {
        if (!isShuffling) {
            const queue = await TrackPlayer.getQueue();
            setOriginalQueue(queue);
            shufflePlaylist(queue);
        } else {
            unshufflePlaylist();
        }
        setIsShuffling(!isShuffling);
    };

    const shufflePlaylist = async (queue: any[]) => {
        const currentTrackIndex = await TrackPlayer.getCurrentTrack();
        const shuffledQueue = queue.slice().sort(() => Math.random() - 0.5);
        await TrackPlayer.reset();
        await TrackPlayer.add(shuffledQueue);
        await TrackPlayer.skip(currentTrackIndex);
    };

    const unshufflePlaylist = async () => {
        const currentTrackIndex = await TrackPlayer.getCurrentTrack();
        await TrackPlayer.reset();
        await TrackPlayer.add(originalQueue);
        await TrackPlayer.skip(currentTrackIndex);
    };

    const toggleRepeat = async () => {
        setIsRepeating(!isRepeating);
        await TrackPlayer.setRepeatMode(
            isRepeating ? RepeatMode.Off : RepeatMode.Track
        );
    };


    return (
        <View style={styles.container}>
            <Pressable onPress={toggleShuffle}>
                <Icon style={styles.icon} name={isShuffling ? "shuffle-on" : "shuffle"} size={30} />
            </Pressable>
            {/* <Pressable onPress={() => jumpBackward(10)}>
            <Icon style={styles.icon} name="fast-rewind" size={40} />
        </Pressable> */}
            <Pressable onPress={skipToPrevious}>
                <Icon style={styles.icon} name="skip-previous" size={50} />
            </Pressable>
            <Pressable
                onPress={() => {
                    if (isPlaybackState(playBackState.state)) {
                        togglePlayback(playBackState.state);
                    }
                }}
            >
                <Icon
                    style={styles.playButton}
                    name={isPlaybackState(playBackState.state) && playBackState.state === State.Playing ? "pause" : "play-arrow"}
                    size={75}
                />
            </Pressable>
            <Pressable onPress={skipToNext}>
                <Icon style={styles.icon} name="skip-next" size={50} />
            </Pressable>
            {/* <Pressable onPress={() => jumpForward(10)}>
            <Icon style={styles.icon} name="fast-forward" size={40} />
        </Pressable> */}
            <Pressable onPress={toggleRepeat}>
                <Icon style={styles.icon} name={isRepeating ? "repeat-on" : "repeat"} size={30} />
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
        padding: 5
    },
    icon: {
        color: '#FFFFFF',
        marginHorizontal: 20,
    },
    playButton: {
        color: '#FFFFFF',
        marginHorizontal: 5,
    }
});

export default ControlCenter;
