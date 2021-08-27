/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer, contextBridge } from 'electron';
import { Action, Channel } from './bridge';

contextBridge.exposeInMainWorld('api', {
  send: (channel: Channel, data: any) => {
    const validChannels = [];

    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel: Channel, callback: (...args: any) => void) => {
    const validChannels = ['SHORTCUT', 'UPDATE_AVAILABLE'];

    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => callback(...args));
    }
  },
});

ipcRenderer.on(Channel.SHORTCUT, (_, action) => {
  switch (action) {
    case Action.NEW: {
      document.getElementById('create').focus();
      break;
    }
    case Action.EDIT: {
      if (document.activeElement) {
        const checkboxIndex = (document.activeElement as HTMLElement).dataset.checkboxIndex;

        if (checkboxIndex) {
          const checkbox = document.querySelector(`[data-checkbox-text-index="${checkboxIndex}"]`);
          (checkbox as HTMLInputElement).focus();
        } else {
          const firstCheckbox = document.querySelector('[data-checkbox-text-index="1"]');

          if (firstCheckbox) {
            (firstCheckbox as HTMLInputElement).focus();
          }
        }
      }
      break;
    }
    case Action.COMPLETE: {
      if (document.activeElement) {
        const checkboxIndex = (document.activeElement as HTMLElement).dataset.checkboxIndex;

        if (checkboxIndex) {
          (document.activeElement as HTMLInputElement).click();
        }
      }
      break;
    }
    case Action.LAST: {
      const checkboxes = document.querySelectorAll('[data-checkbox-index]');

      if (checkboxes && checkboxes.length) {
        (checkboxes[checkboxes.length - 1] as HTMLInputElement).focus();
      }
      break;
    }
    default:
      break;
  }

  const navigation = [
    Action.FIRST,
    Action.SECOND,
    Action.THIRD,
    Action.FOURTH,
    Action.FIFTH,
    Action.SIXTH,
    Action.SEVENTH,
    Action.EIGHTH,
  ];

  if (navigation.includes(action)) {
    const index = navigation.findIndex((nav) => nav === action);
    const checkbox = document.querySelector(`[data-checkbox-index="${index + 1}"]`);

    if (checkbox) {
      (checkbox as HTMLInputElement).focus();
    }
  }
});
