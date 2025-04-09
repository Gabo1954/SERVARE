import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ContactScreen'>;

const ContactScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const phoneNumber = '+5491112345678'; // Reemplazar con tu número
  const email = 'soporte@servare.com'; // Reemplazar con tu email

  const openWhatsApp = () => {
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      alert('WhatsApp no está instalado en el dispositivo');
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Contacto y Soporte Técnico</Text>

      {/* Sección de Información de Contacto */}
      <View style={styles.section}>
        <Ionicons name="information-circle" size={24} color="#4D92AD" />
        <Text style={styles.sectionTitle}>Información de contacto</Text>
      </View>
      
      <View style={styles.contactItem}>
        <Ionicons name="call" size={20} color="#fff" />
        <Text style={styles.contactText}>Teléfono: +54 9 11 1234-5678</Text>
      </View>

      <View style={styles.contactItem}>
        <Ionicons name="mail" size={20} color="#fff" />
        <Text style={styles.contactText}>Email: {email}</Text>
      </View>

      {/* Botón de WhatsApp */}
      <TouchableOpacity 
        style={[styles.button, styles.whatsappButton]} 
        onPress={openWhatsApp}
      >
        <Ionicons name="logo-whatsapp" size={24} color="white" />
        <Text style={[styles.buttonText, { color: 'white' }]}>Chat por WhatsApp</Text>
      </TouchableOpacity>

      {/* Sistema de Tickets */}
      <View style={styles.section}>
        <Ionicons name="ticket" size={24} color="#4D92AD" />
        <Text style={styles.sectionTitle}>Sistema de Tickets</Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('CreateTicketScreen')}
      >
        <Text style={styles.buttonText}>Crear nuevo ticket</Text>
      </TouchableOpacity>

      {/* Botón de Volver */}
      <TouchableOpacity 
        style={[styles.button, styles.backButton]} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#1E3A47',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    color: '#4D92AD',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '600',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 20,
  },
  contactText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    marginVertical: 15,
  },
  backButton: {
    backgroundColor: '#4D92AD',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B2D45',
    marginLeft: 10,
  },
});

export default ContactScreen;