import firebase from 'react-native-firebase';
// import Snackbar from 'react-native-snackbar';
import SnackBar from 'rn-snackbar'

const DOMAIN = 'https://binmobileapp.firebaseapp.com';
// const DOMAIN = 'http://localhost:5000';



// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript#46181
export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function padZero(x) {
  return ('00' + x).slice(-2);
}

export function yymmdd(d) {
return     d.getFullYear() +
'-' +
('0' + (1 + d.getMonth())).slice(-2) +
'-' +
('0' + d.getDate()).slice(-2);

}

function hhmm(d) {
  return `${padZero(d.getHours())}:${padZero(d.getMinutes())}`;
}

function hhmmss(d) {
  return `${padZero(d.getHours())}:${padZero(d.getMinutes())}:${padZero(d.getSeconds())}`;
}


export function formatDateTime(d) {
  return yymmdd(d) + ' ' + hhmmss(d);
}

export function yymmddTime(d) {
  return yymmdd(d) + ' ' + hhmm(d);
}

export function textSlotsToslots(ary) {
  let slots = [];
  for (let i = 0; i < 48; i++) {
    slots.push(ary.indexOf(slotToText(i)) != -1 ? 1 : 0);
  }
  return slots;
}

export function textslotsToText(ary) {
  return slotsToText(textSlotsToslots(ary));
}

export function slotToText(ind) {
  // 19 => '09:30'
  let fStart = ind / 2;
  return padZero(Math.floor(fStart)) + ':' + (fStart % 1 == 0.5 ? '30' : '00');
}

export function slotsToText(ary) {
  //[0,0,....1,0] => '9:30-11:00'
  let ret = '';
  let start = null;
  for (let i = 0; i < 48; i++) {
    if (ary[i] != 0) {
      if (start == null) {
        start = i;
      }
    } else {
      if (start != null) {
        if (ret != '') {
          ret += ', ';
        }

        let fStart = start / 2;
        let fEnd = i / 2;

        ret += padZero(Math.floor(fStart)) + ':' + (fStart % 1 == 0.5 ? '30' : '00');
        ret += '-';
        ret += padZero(Math.floor(fEnd)) + ':' + (fEnd % 1 == 0.5 ? '30' : '00');
        start = null;
      }
    }
  }
  if (start != null) {
    if (ret != '') {
      ret += ', ';
    }
    let fStart = start / 2;
    ret += padZero(Math.floor(fStart)) + ':' + (fStart % 1 == 0.5 ? '30' : '00');
    ret += '-';
    ret += '00:00';
  }
  ret = ret.replace('00:00-00:00', '全日')
  return ret;
}


export function message(msg) {
  SnackBar.show(msg, { 
    style: { justifyContent: 'center', alignItems: 'center', zIndex: 99999 },
    duration: 2000, 
    tapToClose: true,
    onDismiss: () => {},
    backgroundColor: '#BFDFEE',
    buttonColor: 'blue',
    textColor: 'gray'});
}

export function alert(msg, cb) {
  SnackBar.show(msg, { 
    style: { justifyContent: 'center', alignItems: 'center', zIndex: 99999 },
    isStatic: true, 
    tapToClose: true ,
    onDismiss: cb || (() => {}),
    backgroundColor: 'red',
    buttonColor: 'blue',
    textColor: 'white'});
}

/* Triggers */
export function notifyRoomRequest(reqId) {
  return fetch(DOMAIN + '/processRequest/' + reqId).then(res =>
    res.json()
  );
}
export function notifyRoomCreate(roomId) {
  return fetch(
    DOMAIN + '/indexRoomTimeSlot/' + roomId
  ).then(res => res.json());
}

/* Firebase */
export async function getPrice(bookings) {

  let data = [];

  bookings.map(booking => {
    data.push({
      roomId: booking.roomId,
      date: booking.date,
      slots: booking.slots
    });
  });

  let body = {data};

  return fetch(DOMAIN + '/getPrice', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(res =>
    res.json()
  ).then(res =>
    {
      // console.warn(JSON.stringify(res));
      return res;
    }
  );
}

export function login(email, password) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(x => {
      return firebase
        .firestore()
        .collection('users')
        .doc(x.user.uid)
        .get();
    })
    .catch(err => {
      switch (err.code) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            alert('登入失敗，請檢查你輸入的帳號和密碼');
            break;
        default:
          console.warn(err.code)
          alert('登入失敗:' + err.userInfo.NSLocalizedDescription);
      }
    });
}

export function logout(dispatch) {
  
  dispatch({type:'chatroomsSubscription', data: {unsubscribe: null}});
  dispatch({type:'logout'});  
}

export function createAdhoc(option) {
  const data = {
    date: option.date,
    roomId: option.roomId,
    room: option.room,
    hostId: option.hostId,
    price: option.price,
    isOpen: option.isOpen,
    slots: option.slots
  };
  
  let ref = firebase
  .firestore()
  .collection('adhoc')
  .doc();
  const createTime = firebase.firestore.FieldValue.serverTimestamp();

  ref.set({
    ...data,
    createTime
  });

  notifyRoomCreate(option.roomId);
}

export function deleteAdhoc(roomId, refId) {
  let ref = firebase
  .firestore()
  .collection('adhoc')
  .doc(refId);

  ref.delete();
  notifyRoomCreate(roomId);
}

export function loadGetHostRooms(hostId) {
  return (
    firebase
      .firestore()
      .collection('rooms')
      .where('createdBy', '==', hostId)
      .get()
      .then(sp =>
        {
          return sp.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((x, y) => {
            return x.createTime < y.createTime;
          })

        }
      )
  );
}

export function loadGetUserPaymentRecords(userId) {
  return (
    firebase
      .firestore()
      .collection('requests')
      .where('createdBy', '==', userId)
      // .orderBy('createTime', 'desc') //don't know why not working, just sort on client side
      .get()
      .then(sp =>
        sp.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((x, y) => {
            return x.createTime < y.createTime;
          })
      )
  );
}

export function loadHostPaymentRecords(userId) {
  return (
    firebase
      .firestore()
      .collection('bookings')
      .where('hostId', '==', userId)
      // .orderBy('createTime', 'desc') //don't know why not working, just sort on client side
      .get()
      .then(sp =>
        sp.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((x, y) => {
            return x.createTime < y.createTime;
          })
      )
  );
}

export function loadRoomAdhocSlots(userId) {
  return (
    firebase
      .firestore()
      .collection('adhoc')
      .where('hostId', '==', userId)
      // .orderBy('createTime', 'desc') //don't know why not working, just sort on client side
      .get()
      .then(sp =>
        sp.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
      )
  );
}



export function getSlots(roomId, date) {
  return firebase
    .firestore()
    .collection('roomslots')
    .where('roomId', '==', roomId)
    .where('date', '==', date)
    .get()
    .then(sp =>
      sp.docs.map(doc => {
        const data = doc.data();
        return { slots: data.slots, prices: data.prices };
      })
    )
    .then(ary => ary[0]);
}
// export async function getBookedSlots(roomId, date) {
//   return firebase
//     .firestore()
//     .collection("bookings")
//     .where("date", "==", date)
//     .where("roomId", "==", roomId)
//     .get()
//     .then(sp =>
//       sp.docs.map(doc => ({
//         ...doc.data().slots
//       }))
//     )
//     .then(ary => {
//       let ret = {};
//       ary.map(x => {
//         ret = { ...ret, ...x };
//       });
//       return ret;
//     });
// }

export async function chatToHost(hostId, message, dispatch) {
  let userId = firebase.auth().currentUser.uid;
  
  let roomFound = false;
  firebase
  .firestore()
  .collection('chatrooms')
  .where('hostId', '==', hostId)
  .where('userId', '==', userId)
  .get()
  .then(ss => {
    ss.forEach(doc => {
      roomFound = true;
      firebase
      .firestore()
      .collection('chatrooms').doc(doc.id).update({
        hostNewMessage: firebase.firestore.FieldValue.increment(1),
        lastMessage: message, 
        lastMessageTime: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    if (!roomFound) {
      let room = {lastMessage: message, lastMessageTime: firebase.firestore.FieldValue.serverTimestamp() };
      firebase
      .firestore()
      .collection('users')
      .doc(hostId)
      .get()
      .then(doc => {
        room.hostId = hostId;
        room.host = doc.data().name;

        firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .get()
          .then(doc => {
            room.userId = userId;
            room.user = doc.data().name;

            let newdoc = firebase
              .firestore()
              .collection('chatrooms')
              .doc();
            
            dispatch({
              type:'currentChatroomId', 
              data: newdoc.id});
            newdoc.set(room);
          });
      });
    }
  });


  firebase
  .firestore()
  .collection('chats')
  .doc()
  .set({
    hostId,
    userId,
    byId: userId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    message
  });
}

export async function chatToUser(userId, message,dispatch) {
  let hostId = firebase.auth().currentUser.uid;

  let roomFound = false;
  firebase
  .firestore()
  .collection('chatrooms')
  .where('hostId', '==', hostId)
  .where('userId', '==', userId)
  .get()
  .then(ss => {
    ss.forEach(doc => {
      roomFound = true;
      firebase
      .firestore()
      .collection('chatrooms').doc(doc.id).update({
        userNewMessage: firebase.firestore.FieldValue.increment(1),
        lastMessage: message, 
        lastMessageTime: firebase.firestore.FieldValue.serverTimestamp()});
    });
    if (!roomFound) {
      let room = {lastMessage: message, lastMessageTime: firebase.firestore.FieldValue.serverTimestamp() };
      firebase
      .firestore()
      .collection('users')
      .doc(hostId)
      .get()
      .then(doc => {
        room.hostId = hostId;
        room.host = doc.data().name;

        firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .get()
          .then(doc => {
            room.userId = userId;
            room.user = doc.data().name;

            let newdoc = firebase
              .firestore()
              .collection('chatrooms')
              .doc();
            
            dispatch({
              type:'currentChatroomId', 
              data: newdoc.id});
            newdoc.set(room);
          });
      });
    }
  });


  firebase
  .firestore()
  .collection('chats')
  .doc()
  .set({
    hostId,
    userId,
    byId: hostId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    message
  });
}

export async function getChatrooms() {
  let userId = firebase.auth().currentUser.uid;

  let ref = firebase
  .firestore()
  .collection('chatrooms')
  .where('userId', '==', userId);

  
  let ret = ref
    // .orderBy('timestamp', 'desc')
    .limit(10)
    .get()
    .then(sp => 
      sp.docs.map(doc => (
        {id:doc.id, ...doc.data()}
      )
    ))
    .then(msg => msg.reverse())
    return ret;

}

// export async function getChatroomsForHost() {
//   let hostId = firebase.auth().currentUser.uid;
//   let ret = firebase
//     .firestore()
//     .collection('chatrooms')
//     .where('hostId', '==', hostId)
//     // .orderBy('timestamp', 'desc')
//     .limit(10)
//     .get()
//     .then(sp => 
//       sp.docs.map(doc => (
//         {id:doc.id, ...doc.data()}
//       )
//     ))
//     .then(msg => msg.reverse())
//     return ret;

// }

// export async function getChats(hostId, userId, callback) {
//   let ref = firebase
//     .firestore()
//     .collection('chats')
//     .where('hostId', '==', hostId)
//     .where('userId', '==', userId)
//     .orderBy('timestamp', 'desc')
//     .limit(10)

//     let unreg = ref.onSnapshot(querySnapshot => {
//       querySnapshot.docChanges.forEach(change => {
//         if (change.type === 'added') {
//           // console.warn(change.doc.data());
//           callback({id: change.doc.id, ...change.doc.data()});
//         }
//       });
//       // .docChanges().forEach(change => {
//       //   if (change.type === 'added') {
//       //     console.warn(change.doc.data());
//       //   }
//       // })
//     });

//   let ret = ref
//     .get()
//     .then(sp => sp.docs.map(doc => ({id:doc.id, ...doc.data()})))
//     .then(msg => {
//       return [msg.reverse(), unreg];
//     });
//     return ret;
// }

export function formatTimestampAsDate(x) {
  if (x == null) {
    return '';
  }
  let d = x.toDate();
  return yymmdd(d);
}

export function formatTimestampAsTime(x) {
  if (x == null) {
    return '';
  }
  let d = x.toDate();
  return hhmm(d);
}

export function formatTimestamp(x) {
  if (x == null) {
    return '';
  }
  let d = x.toDate();
  let today = new Date().toDateString();
  let y = d.toDateString();

  if (today == y) {
    return hhmm(d);
  }
  else {
    return yymmdd(d);
  }
}
