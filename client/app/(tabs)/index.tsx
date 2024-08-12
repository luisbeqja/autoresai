import { StyleSheet, ScrollView, View, SafeAreaView } from 'react-native';
import HeaderComponent from '@/components/ui/Header';
import CardComponent from '@/components/ui/Card';
import ResponsesNumberComponent from '@/components/ui/ResponsesNumber';
import ModalMessageComponent from '@/components/ui/ModalMessage';
import ChatComponent from '@/components/ui/ChatComponent';
import { useEffect, useRef, useState } from 'react';

export default function HomeScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    ws.current = new WebSocket('ws://localhost:3000/ws');

    // WebSocket connection opened
    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('Connected to WebSocket');
    };

    // WebSocket connection closed
    ws.current.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket');
    };

    // WebSocket error
    ws.current.onerror = (error: any) => {
      console.error('WebSocket error Luis:', error);
    };

    // Handle incoming messages
    ws.current.onmessage = (event: WebSocketMessageEvent) => {
      const newMessage = JSON.parse(event.data) as any;
      const hours = new Date(newMessage.sender.Timestamp).getHours();
      const minutes = new Date(newMessage.sender.Timestamp).getMinutes();
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;

      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];

        if (
          lastMessage &&
          lastMessage.sender.Sender === newMessage.sender.Sender
        ) {
          // If the sender is the same, add the new message to the existing message array
          return prevMessages.map((message, index) =>
            index === prevMessages.length - 1
              ? {
                  ...message,
                  messages: [...message.messages, newMessage.message],
                }
              : message
          );
        } else {
          // If the sender is different, create a new message entry
          return [
            ...prevMessages,
            {
              id: Date.now().toString(),
              hour: formattedTime,
              messages: [newMessage.message],
              ...newMessage,
            },
          ];
        }
      });

      console.log('Message received:', messages);
    };

    // Cleanup on component unmount
    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <SafeAreaView>
      <HeaderComponent />
      <ScrollView style={{ height: '100%' }}>
        <View style={styles.homeContainer}>
          <CardComponent
            isMessage={false}
            name="Luis Beqja"
            phoneNumber="+39 389 782 2734"
            usageTimingDay="Every weekday"
            usageTimingHour="9:00 - 10:00"
            image={require('@/assets/images/profile-pic.jpg')}
            messages={['']}
          />
          <View style={styles.messagesContainer}>
            <ResponsesNumberComponent />
            {messages.map((message, index) => (
              <CardComponent
                key={index}
                isMessage={true}
                name={message.sender.PushName}
                phoneNumber={message.sender.Sender}
                usageTimingDay="Today"
                usageTimingHour={message.hour}
                image={message.pic}
                messages={message.messages}
              />
            ))}
          </View>
        </View>
        <ChatComponent />
      </ScrollView>
      <ModalMessageComponent></ModalMessageComponent>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 40,
    marginTop: 20,
    width: '100%',
    display: 'flex',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  messagesContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
    width: '100%',
    display: 'flex',
  },
});
