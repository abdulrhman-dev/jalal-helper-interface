import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'get-data-xlsx' | 'configure' | 'delete-duplicate';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args?: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    invoke(channel: Channels, args?: unknown[]) {
      ipcRenderer.invoke(channel, args);
    },
    invokeAsync: async (
      channel: Channels,
      args?: unknown[]
    ): Promise<unknown> => {
      const res = await ipcRenderer.invoke(channel, args);

      return res;
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
