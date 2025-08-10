import Echo from "laravel-echo";
import Pusher from "pusher-js";
window.Pusher = Pusher;
window.Pusher.logToConsole = true;
const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  wsHost: import.meta.env.VITE_PUSHER_HOST || `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
  wsPort: import.meta.env.VITE_PUSHER_PORT || 443,
  forceTLS: true,
  enabledTransports: ["ws", "wss"],


});

export default echo;
//  authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
//   auth: {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT lưu ở localStorage
//     },
//   },