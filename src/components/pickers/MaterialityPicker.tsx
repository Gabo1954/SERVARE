import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../../styles/globalStyles';

interface Materiality {
  codigo: string;
  nombre: string;
}

const MaterialityPicker = () => {
  const [materialities, setMaterialities] = useState<Materiality[]>([]);

  useEffect(() => {
    const loadMaterialities = async () => {
      try {
        const data = await AsyncStorage.getItem('materialities');
        setMaterialities(data ? JSON.parse(data) : []);
      } catch (error) {
        console.error('Error loading materialities:', error);
        setMaterialities([]);
      }
    };
    loadMaterialities();
  }, []);

  return (
    <Picker
      style={globalStyles.input} // Usar estilo existente o agregar 'picker' en globalStyles
      dropdownIconColor="#1E3A47"
    >
      {materialities.map(mat => (
        <Picker.Item 
          key={mat.codigo} 
          label={mat.nombre} 
          value={mat.codigo} 
        />
      ))}
    </Picker>
  );
};

export default MaterialityPicker;