import { Channels } from '../main/preload';

declare global {
  interface Window {
    electron: {
      close: CallableFunction;
      minimize: CallbackFunction;
      maximizeToggle: CallbackFunction;
      ipcRenderer: {
        sendMessage(channel: Channels, args?: unknown[]): void;
        invoke(channel: Channels, args?: unknown[]): unknown;
        invokeAsync<T>(
          channel: Channels,
          args?: unknown | unknown[]
        ): Promise<T>;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
