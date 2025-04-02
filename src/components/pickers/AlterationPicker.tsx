import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../../styles/globalStyles';

interface Alteration {
  codigo: string;
  nombre: string;
}

const AlterationPicker = () => {
  const [alterations, setAlterations] = useState<Alteration[]>([]);

  useEffect(() => {
    const loadAlterations = async () => {
      try {
        const data = await AsyncStorage.getItem('alterations');
        setAlterations(data ? JSON.parse(data) : []);
      } catch (error) {
        console.error('Error loading alterations:', error);
        setAlterations([]);
      }
    };
    loadAlterations();
  }, []);

  return (
    <Picker
      style={globalStyles.input} // Usar un estilo existente o agregar 'picker' a globalStyles
      dropdownIconColor="#1E3A47"
    >
      {alterations.map(alt => (
        <Picker.Item 
          key={alt.codigo} 
          label={alt.nombre} 
          value={alt.codigo} 
        />
      ))}
    </Picker>
  );
};

export default AlterationPicker;