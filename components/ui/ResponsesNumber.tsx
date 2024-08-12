import {StyleSheet, View, Text } from 'react-native';
 
export default function ResponsesNumberComponent() {
  return (
    <View style={styles.responses}>
      <Text style={{ color: '#4894FE', fontSize: 16 }}>Responses today - 5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  responses: {
    backgroundColor: '#E0F0FF',
    padding: 16,
    borderRadius: 100,
    width: 'auto',
    alignItems: 'center',
    paddingHorizontal: 32
  },
});
