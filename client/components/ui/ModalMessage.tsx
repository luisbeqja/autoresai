import Modal from 'react-native-modal';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useRecoilState } from 'recoil';
import { messageDetailState } from '@/store/atom';
import ChatBubbleComponent from '@/components/ui/ChatBubble';
export default function ModalMessageComponent() {
  const [store, setModal] = useRecoilState(messageDetailState);

  const close = () => {
    setModal({
      isVisible: false,
      messageUser: [],
      messageBot: [],
      userName: '',
    });
  };

  return (
    <View style={styles.viewContainer}>
      <Modal
        testID={'modal'}
        isVisible={store.isVisible}
        onSwipeComplete={close}
        swipeDirection={'down'}
        style={styles.view}
      >
        <View style={styles.content}>
          <Text style={styles.contentTitle}>{store.userName}</Text>
          <View style={{ marginTop: 30, width: '100%' }}>
            <ChatBubbleComponent isLeft={true} messages={store.messageUser} />
            <ChatBubbleComponent isLeft={false} messages={store.messageBot} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: 600,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});
