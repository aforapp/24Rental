import React, { useState, useEffect } from 'react';
import { useStateValue } from '../state';
import { Text, View, Platform } from 'react-native';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import Icon from 'react-native-vector-icons/Ionicons';

const IconWithBadgeMsg = props => {
  const [{ auth, chatrooms, currentChatroomId }, dispatch] = useStateValue();
  const { name, color, size } = props;
  const [ count, setCount ] = useState(0);

  useEffect(() => {
    if (auth.id == null) {
      setCount(0);
      if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(0);
      }
    }
    else {
      let c = 0;
      chatrooms.map(x => {
        if (x.id != currentChatroomId) {
          if (auth.isHost) {
            c += x.hostNewMessage || 0;
          }
          else {
            c += x.userNewMessage || 0;
          }
        }
      });
      setCount(c);
      if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(c);
      }
    }

  }, [auth, chatrooms]);

  return (
    <View style={{ width: 24, height: 24, margin: 5 }}>
      <Icon name={name} size={size} color={color} />
      {count > 0 && (
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
            {count}
          </Text>
        </View>
      )}
    </View>
  );
};

export default IconWithBadgeMsg;
