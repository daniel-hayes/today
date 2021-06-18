export enum Channel {
  SHORTCUT = 'SHORTCUT',
  UPDATE_AVAILABLE = 'UPDATE_AVAILABLE',
}

export enum Action {
  DELETE = 'DELETE',
  SETTINGS = 'SETTINGS',
}

type Callback = (action: Action) => void;

type API = {
  on: (string: string, callback: Callback) => void;
};

declare global {
  interface Window {
    api: API;
  }
}

function bridge(channel: Channel, callback: Callback): void {
  window.api.on(channel, callback);
}

export default bridge;
