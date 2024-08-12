import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRecoilState } from 'recoil';
import { messageDetailState } from '@/store/atom';
import { useState } from 'react';
type CardComponentProps = {
  isMessage: boolean;
  name?: string;
  phoneNumber?: string;
  usageTimingDay?: string;
  usageTimingHour?: string;
  messageDetail?: string;
  image?: any;
};

export default function CardComponent(props: CardComponentProps) {
  const [isModalVisible, setIsModalVisible] =
    useRecoilState(messageDetailState);

  const [userDetail, setUserDetail ] = useState(false);

  const showModal = () => {
    setIsModalVisible({
      isVisible: true,
      messageUser: 'Hello Luis, how are you?',
      messageBot:
        'Hey Matteo, happy to hear from you! I am currently working and cant really talk right now. This is an automated message. I will get back to you as soon as possible.',
      userName: props.name || '',
    });
  };

  return (
    <>
      <View
        style={[
          styles.card,
          props.isMessage
            ? { backgroundColor: '#FFFFFF' }
            : { backgroundColor: '#4894FE' },
        ]}
      >
        <View style={{ width: '100%' }}>
          <View style={styles.userInfo}>
            <Image
              source={props.image}
              style={{
                width: 56,
                height: 56,
                marginRight: 12,
                borderRadius: 100,
              }}
            />
            <View style={{ gap: 8 }}>
              <Text
                style={[
                  styles.name,
                  props.isMessage ? { color: '#0D1B34' } : { color: '#FFFFFF' },
                ]}
              >
                {props.name}
              </Text>
              <Text
                style={[
                  styles.number,
                  props.isMessage ? { color: '#8696BB' } : { color: '#FFFFFF' },
                ]}
              >
                {props.phoneNumber}
              </Text>
            </View>
            {!props.isMessage && (
              <Pressable
                style={{
                  position: 'absolute',
                  right: 0,
                  margin: 'auto',
                  transform: userDetail
                    ? [{ rotate: '-90deg' }]
                    : [{ rotate: '90deg' }],
                }}
                onPress={() => setUserDetail(!userDetail)}
              >
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={24}
                  color="#FFFFFF"
                />
              </Pressable>
            )}
          </View>
          <View
            style={[
              {
                borderBottomColor: '#FFFFFF',
                borderBottomWidth: StyleSheet.hairlineWidth,
                width: '100%',
                marginTop: 16,
                opacity: 0.5,
              },
              props.isMessage
                ? { borderBottomColor: '#8696BB' }
                : { borderBottomColor: '#FFFFFF' },
            ]}
          />
          <View style={styles.usageTiming}>
            <MaterialCommunityIcons
              name="calendar-multiselect"
              size={16}
              color={props.isMessage ? '#8696BB' : '#FFFFFF'}
            />
            <Text
              style={[
                {
                  fontSize: 16,
                  width: '50%',
                  marginLeft: 5,
                },
                props.isMessage ? { color: '#8696BB' } : { color: '#FFFFFF' },
              ]}
            >
              {props.usageTimingDay}
            </Text>
            <MaterialCommunityIcons
              name="clock-time-eleven-outline"
              size={16}
              color={props.isMessage ? '#8696BB' : '#FFFFFF'}
            />
            <Text
              style={[
                {
                  fontSize: 16,
                  width: '50%',
                  marginLeft: 5,
                },
                props.isMessage ? { color: '#8696BB' } : { color: '#FFFFFF' },
              ]}
            >
              {props.usageTimingHour}
            </Text>
          </View>
          {props.isMessage && (
            <Pressable style={styles.button} onPress={showModal}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#4894FE',
                  textAlign: 'center',
                }}
              >
                Message Detail
              </Text>
            </Pressable>
          )}
          {!props.isMessage && userDetail && (
            <Pressable style={[styles.button, { borderRadius: 12 }]}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#FE4848',
                  textAlign: 'center',
                }}
              >
                STOP
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#5A75A7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  number: {
    fontSize: 16,
    fontWeight: 'regular',
    color: '#FFFFFF',
  },
  usageTiming: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: '#E0F0FF',
    borderRadius: 100,
    padding: 12,
    marginTop: 20,
    width: '100%',
  },
});
