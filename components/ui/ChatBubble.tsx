import Modal from 'react-native-modal';
import { Button, StyleSheet, Text, View } from 'react-native';

type ChatBubbleComponentProps = {
  isLeft: boolean;
  message: string;
};

export default function ChatBubbleComponent(props: ChatBubbleComponentProps) {
  return (
    <>
      {props.isLeft ? (
        <View style={[styles.container, styles.leftContainer]}>
          <Text style={styles.textLeft}>{props.message}</Text>
          <Text
            style={{
              fontSize: 12,
              color: '#000',
              paddingVertical: 5,
              opacity: 0.6,
            }}
          >
            12.30
          </Text>
          <View style={styles.leftArrow} />
          <View style={styles.leftArrowOverlap} />
        </View>
      ) : (
        <View style={[styles.container, styles.rightContainer]}>
          <Text style={styles.text}>{props.message}</Text>
          <Text
            style={{
              fontSize: 12,
              color: 'white',
              paddingVertical: 5,
              textAlign: 'right',
              opacity: 0.6,
            }}
          >
            12.30
          </Text>
          <View style={styles.rightArrow} />
          <View style={styles.rightArrowOverlap} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 25,
    maxWidth: '80%',
  },
  leftContainer: {
    backgroundColor: '#e5e5ea',
    marginLeft: '5%',
    alignSelf: 'flex-start',
  },
  rightContainer: {
    backgroundColor: '#0078fe',
    marginRight: '5%',
    alignSelf: 'flex-end',
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  textLeft: {
    fontSize: 16,
    color: '#000',
  },
  leftArrow: {
    position: 'absolute',
    backgroundColor: '#e5e5ea',
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },
  leftArrowOverlap: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20,
  },
  rightArrow: {
    position: 'absolute',
    backgroundColor: '#0078fe',
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10,
  },
  rightArrowOverlap: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20,
  },
});
