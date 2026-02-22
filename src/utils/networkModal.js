import { DeviceEventEmitter } from 'react-native';

const NETWORK_ERROR_EVENT = 'network:error';

export const emitNetworkError = (message) => {
  DeviceEventEmitter.emit(
    NETWORK_ERROR_EVENT,
    message || 'Please check your network and try again'
  );
};

export const addNetworkErrorListener = (handler) =>
  DeviceEventEmitter.addListener(NETWORK_ERROR_EVENT, handler);
