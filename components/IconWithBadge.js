import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const IconWithBadge = props => {
  const [{ cart }, dispatch] = useStateValue();
  const { name, color, size } = props;
  return (
    <View style={{ width: 24, height: 24, margin: 5 }}>
      <Icon name={name} size={size} color={color} />
      {cart.bookings.length > 0 && (
        <View
          style={{
            // If you're using react-native < 0.57 overflow outside of the parent
            // will not work on Android, see https://git.io/fhLJ8
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: 'red',
            borderRadius: 6,
            width: 12,
            height: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
            {cart.bookings.length}
          </Text>
        </View>
      )}
    </View>
  );
};

export default IconWithBadge;
