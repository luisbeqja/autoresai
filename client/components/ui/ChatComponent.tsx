import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

interface Message {
  id: string;
  text: string;
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
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
    ws.current.onerror = (error) => {
      console.error('WebSocket error Luis:', error);
    };

    // Handle incoming messages
    ws.current.onmessage = (event: WebSocketMessageEvent) => {
      const newMessage = event.data as string;
/*       setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: newMessage },
      ]); */
     
      console.log('Message received:',  JSON.parse(newMessage));
    };

    // Cleanup on component unmount
    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== '' && ws.current) {
      ws.current.send(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  statusBar: {
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    color: 'gray',
  },
  messagesList: {
    flex: 1,
    marginBottom: 20,
  },
  messageContainer: {
    padding: 10,
    backgroundColor: '#e4e4e4',
    borderRadius: 4,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ChatComponent;
