import React, { createContext, useContext, useReducer } from 'react';
import firebase from 'react-native-firebase';

export const StateContext = createContext();

export const useStateValue = () => useContext(StateContext);

const initialState = {
  auth: {},
  rooms: [],
  cart: {
    bookings: [],
    reqId: null,
  },
  chats: [],
  chatrooms: [],
  currentChatroomId: null,
  chatroomsSubscription: null,
  openChat: {},
};

export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

function reducer(state, action) {
  switch (action.type) {
    case 'auth':
      return {
        ...state,
        auth: action.data,
      };

    case 'logout':
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log('logout: success');
        })
        .catch(err => {
          console.log('logout err: ', err);
        });

      return {
        ...state,
        auth: {},
      };

    case 'chats':
      // console.warn(action.data)
      let chats = [...action.data, ...state.chats];

      for (let i = 0; i < chats.length; i++) {
        if (chats[i].isHeader) {
          chats.splice(i, 1);
        }
      }
      action.modified.map(x => {
        for (let i = chats.length - 1; i >= 0; i--) {
          if (chats[i].id == x.id) {
            chats[i] = { ...chats[i], ...x };
          }
        }
      });

      chats = chats.reverse();
      if (chats.length > 0 && chats[0].datestamp != '') {
        chats.splice(0, 0, { isHeader: true, title: chats[0].datestamp });
      }
      for (let i = 2; i < chats.length; i++) {
        if (
          chats[i].datestamp != chats[i - 1].datestamp &&
          chats[i].datestamp != ''
        ) {
          chats.splice(i, 0, { isHeader: true, title: chats[i].datestamp });
          i++;
        }
      }
      chats = chats.reverse();

      return {
        ...state,
        chats,
      };

    case 'openChat':
      return {
        ...state,
        openChat: action.data,
      };

    case 'resetChats':
      return {
        ...state,
        chats: [],
      };

    case 'resetChatrooms':
      return {
        ...state,
        chatrooms: [],
      };

    case 'currentChatroomId':
      // console.warn('currentChatroomId', action.data)
      return {
        ...state,
        currentChatroomId: action.data,
      };

    case 'chatroomsSubscription':
      if (state.unsubscribe) {
        //unsubscribe previous subscription
        state.unsubscribe();
      }
      return {
        ...state,
        unsubscribe: action.data.unsubscribe,
      };

    case 'chatrooms':
      let rooms = [...state.chatrooms];
      for (let data of action.data) {
        let found = false;
        for (let room of rooms) {
          if (room.id === data.id) {
            found = true;
            break;
          }
        }
        if (!found) {
          rooms.push(data);
        }
      }
      action.modified.map(x => {
        for (let i = 0; i < rooms.length; i++) {
          if (rooms[i].id == x.id) {
            rooms[i] = { ...rooms[i], ...x };
          }
        }
      });
      let def = { seconds: 99999999999999 };
      rooms.sort(
        (x, y) =>
          (y.lastMessageTime || def).seconds -
          (x.lastMessageTime || def).seconds,
      );
      return {
        ...state,
        chatrooms: rooms,
      };

    case 'rooms':
      return {
        ...state,
        rooms: action.data,
      };

    case 'addBooking':
      return {
        ...state,
        cart: {
          bookings: [...state.cart.bookings, action.data],
          reqId: state.cart.reqId,
        },
      };

    case 'clearBookings':
      return {
        ...state,
        cart: {
          bookings: [],
          reqId: state.cart.reqId,
        },
      };
    case 'cancelBooking':
      let bookings = state.cart.bookings;
      bookings.splice(action.data, 1);

      return {
        ...state,
        cart: {
          bookings: bookings,
          reqId: state.cart.reqId,
        },
      };
    default:
      return state;
  }
}
