import { Image, StyleSheet, View, Text } from 'react-native';

export default function HeaderComponent() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greetings}>Hello,</Text>
        <Text style={styles.name}>Mr. Luis</Text>
      </View>
      <View>
        <Image
          source={require('@/assets/images/avatar.png')}
          style={{ width: 56, height: 56 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D1B34',
  },
  greetings: {
    fontSize: 16,
    fontWeight: 'regular',
    color: '#8696BB',
  },
});
