import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface SocketStateInterface {
  isLoading: boolean,
  isSuccess: boolean,
  messages: any[],

  ws: WebSocket | any;
  isConnected: boolean;
  receivedMessages: string[];
  dataSocket: any;
}

const initState: SocketStateInterface = {
  isLoading: false,
  isSuccess: false,
  messages: [],

  ws: null,
  isConnected: false,
  receivedMessages: [],
  dataSocket: null,
};



const socketSlice = createSlice({
  name: 'socket',
  initialState: initState,
    reducers: {
      addMessageSocket: (state, action) => {
        state.messages.push(action.payload);
      },

      setConnectionStatus: (state, action: PayloadAction<boolean>) => {
        state.isConnected = action.payload;
      },
      addReceivedMessage: (state, action: PayloadAction<string>) => {
        state.receivedMessages.push(action.payload);
      },
      setSocketData: (state, action) => {
        state.dataSocket = action.payload;
      },

    },
  extraReducers: builder => {


  },
});
export const {addMessageSocket, setConnectionStatus, addReceivedMessage, setSocketData } = socketSlice.actions;
export default socketSlice.reducer;


// interface WebSocketOptions {
//   keepAlive?: boolean;
//   keepAliveInterval?: number;
// }
// const options: WebSocketOptions = {
//   keepAlive: true,
//   keepAliveInterval: 60000, // 1 phút
// };
//
// const jwToken = LocalStorage.get(localStorageKey.JWT_TOKEN, '');
// const parseToken = JSON.parse(jwToken);
// const socketUrl = `${baseUrl}/ws/jobs?token=${parseToken}`.replace('https', 'wss');
//
// const ws = new WebSocket(socketUrl);
// let reconnectTimeout: NodeJS.Timeout | null = null;
// const RECONNECT_INTERVAL = 5000; // 5 seconds
// let connected = false;
//
// export const connectWebSocket = () => {
//
//   console.log('123445')
//
//
//   // ws.onopen = () => {
//   //   console.log('ws onopen')
//   //   connected = true;
//   //   // dispatch(setSocketData(ws));
//   //   store.dispatch(setConnectionStatus(true));
//   // };
//
//   // ws.onmessage = (event) => {
//   //   console.log('ws onmessage')
//   //   console.log('ws onmessage event', event.data)
//   //   console.log('equal: ', _.isEqual({message: "Connected"}, JSON.parse(event.data)))
//   //   if (_.isEqual({message: "Connected"}, JSON.parse(event.data))) { // ở lần connect socket, BE trả ra 1 object {message: "Connected"}, nên cần phải check có isEqual ko mới set state
//   //
//   //   }
//   //   store.dispatch(addReceivedMessage(event.data));
//   // };
//
//   ws.addEventListener('open', (event: Event) => {
//     console.log('ws onopen')
//     connected = true;
//     // store.dispatch(setSocketData(ws));
//     clearTimeout(reconnectTimeout as NodeJS.Timeout);
//   });
//
//   ws.addEventListener('message', (event: MessageEvent) => {
//     console.log('ws onmessage')
//     console.log('ws onmessage event', event.data)
//     console.log('equal: ', _.isEqual({message: "Connected"}, JSON.parse(event.data)))
//     if (_.isEqual({message: "Connected"}, JSON.parse(event.data))) { // ở lần connect socket, BE trả ra 1 object {message: "Connected"}, nên cần phải check có isEqual ko mới set state
//
//     }
//     store.dispatch(addReceivedMessage(event.data));
//   });
//
//   ws.addEventListener('close', (event: CloseEvent) => {
//     console.log(`WebSocket disconnected with code ${event.code} and reason ${event.reason}`);
//     connected = false;
//     reconnect();
//   });
//
//   ws.addEventListener('error', (event: Event) => {
//     store.dispatch(setConnectionStatus(false));
//     connected = false;
//   });
//
// };
//
// function reconnect() {
//   if (connected) {
//     // Already connected, no need to reconnect
//     return;
//   }
//
//   clearTimeout(reconnectTimeout as NodeJS.Timeout);
//   reconnectTimeout = setTimeout(() => {
//     console.log('WebSocket reconnecting...');
//     connectWebSocket();
//   }, RECONNECT_INTERVAL);
// }
//
// export function closeWebSocket() {
//   console.log('ws close đây', ws)
//   ws.close(); // Close the connection when you're ready
// }
//
// export const sendWebSocketMessage = (message: string) => {
//   // const { ws } = getState().socket;
//   // const parseWs = ws && JSON.parse(ws)
//   // console.log('ws sendWebSocketMessage', parseWs)
//
//   console.log('sendWebSocketMessage', ws, message)
//
//   if (ws) {
//     ws.send(message);
//   }
// };