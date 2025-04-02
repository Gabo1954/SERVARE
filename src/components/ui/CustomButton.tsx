import React from 'react';
import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  color?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  onPress, 
  color = '#1E3A47' 
}) => (
  <TouchableOpacity 
    style={[globalStyles.buttonPrimary2, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={globalStyles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default CustomButton;