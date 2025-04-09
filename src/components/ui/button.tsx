import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onPress, children }) => (
    <TouchableOpacity onPress={onPress} style={{ padding: 10, backgroundColor: '#007bff', borderRadius: 5 }}>
        <Text style={{ color: 'white', fontSize: 16 }}>{children}</Text>
    </TouchableOpacity>
);

export default Button;