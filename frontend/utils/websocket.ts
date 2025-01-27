import { getStorageItemAsync } from "./storage";

let socket: WebSocket | null = null;

const ENVIRONMENT: string = "home"; // ENVIRONMENT
const API_URL =
  (ENVIRONMENT === "home" && "ws://192.168.76.182:5001") ||
  (ENVIRONMENT === "phone" && "ws://172.20.10.3:5001") ||
  (ENVIRONMENT === "school" && "ws://130.231.3.84:5001");

/**
 * Connect WebSocket
 * This function establishes a WebSocket connection to the server.
 * If a connection already exists and is open, it does nothing.
 * If the connection is established successfully, it sends an authentication token to the server.
 * If the connection is closed or encounters an error, it handles reconnecting as necessary.
 *
 * @param {Object} param - The parameter object.
 * @param {string} param.token - The authentication token to send to the server after the connection is opened.
 */
export const connectWebSocket = async ({ token }: { token: string }) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("WebSocket is already connected");
    return;
  }

  try {
    socket = new WebSocket(`${API_URL}`);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      socket?.send(JSON.stringify({ type: "auth", token }));
    };

    socket.onmessage = (event: MessageEvent) => {
      console.log("Message received: ", event.data);
      // Käsittele vastaanotetut viestit tässä
    };

    socket.onerror = (error: Event) => {
      console.error("WebSocket error: ", error);
    };

    socket.onclose = (event: CloseEvent) => {
      console.log(
        `WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`
      );
      if (event.code !== 1000) {
        console.log("Attempting to reconnect...");
        reconnectWebSocket();
      }
    };
  } catch (error) {
    console.error("Error establishing WebSocket connection: ", error);
  }
};

/**
 * Reconnect WebSocket
 * This function attempts to reconnect to the WebSocket server if the connection is lost.
 * It retrieves the authentication token from storage and uses it to reinitialize the connection.
 * A delay of 5 seconds is introduced before the reconnection attempt.
 */
export const reconnectWebSocket = async () => {
  const authToken = await getStorageItemAsync("session");
  if (authToken) {
    setTimeout(() => {
      console.log("Reconnecting WebSocket...");
      connectWebSocket({ token: authToken });
    }, 5000);
  } else {
    console.warn("Auth token missing. Cannot reconnect WebSocket.");
  }
};

/**
 * Close WebSocket
 */
export const closeWebSocket = () => {
  if (socket) {
    socket.close(1000, "Client closed connection");
    socket = null;
  }
};
