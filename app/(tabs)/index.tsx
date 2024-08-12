import { StyleSheet, ScrollView, View, SafeAreaView } from 'react-native';
import HeaderComponent from '@/components/ui/Header';
import CardComponent from '@/components/ui/Card';
import ResponsesNumberComponent from '@/components/ui/ResponsesNumber';
import ModalMessageComponent from '@/components/ui/ModalMessage';
export default function HomeScreen() {
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
          />
          <View style={styles.messagesContainer}>
            <ResponsesNumberComponent />
            <CardComponent
              isMessage={true}
              name="Matteo Lucia"
              phoneNumber="+39 321 112 2451"
              usageTimingDay="Today"
              usageTimingHour="10:12 AM"
              image={require('@/assets/images/profile-pic-2.jpg')}
            />
          </View>
        </View>
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
