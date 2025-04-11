// MyFichasReport.tsx
import React from 'react';
import { View, Text, StyleSheet,Dimensions } from 'react-native';

const MyFichasReport = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Fichas</Text>
    </View>
  );
};
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E3A47',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MyFichasReport;