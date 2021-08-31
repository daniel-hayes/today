import { Menu, BrowserWindow } from 'electron';
import { Action, Channel } from './bridge';
const isMac = process.platform === 'darwin';

const MenuBuilder = function (
  window: BrowserWindow,
  appName: string
): { buildMenu: () => Menu } {
  const defaultTemplate = [
    {
      label: appName,
      submenu: [
        {
          role: 'about',
          label: 'About',
        },
        {
          type: 'separator',
        },
        {
          label: 'Preferences',
          submenu: [
            {
              label: 'Settings',
              accelerator: 'CommandOrControl+,',
              click() {
                window.show();
                window.webContents.send(Channel.SHORTCUT, Action.SETTINGS);
              },
            },
          ],
        },
        {
          type: 'separator',
        },
        {
          role: 'hide',
          label: 'Hide',
        },
        {
          role: 'unhide',
          label: 'Unhide',
        },
        {
          type: 'separator',
        },
        {
          role: 'quit',
          label: 'Quit',
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo',
          label: 'Undo',
        },
        {
          role: 'redo',
          label: 'Redo',
        },
        {
          type: 'separator',
        },
        {
          role: 'cut',
          label: 'Cut',
        },
        {
          role: 'copy',
          label: 'Copy',
        },
        {
          role: 'paste',
          label: 'Paste',
        },
        ...(isMac
          ? [
              {
                role: 'delete',
                label: 'Delete',
              },
              {
                type: 'separator',
              },
            ]
          : [
              {
                role: 'delete',
                label: 'Delete',
              },
            ]),
      ],
    },
    {
      label: 'Action',
      submenu: [
        {
          label: 'New Todo',
          accelerator: 'CommandOrControl+N',
          click() {
            window.show();
            window.webContents.send(Channel.SHORTCUT, Action.NEW);
          },
        },
        {
          label: 'Edit Todo',
          accelerator: 'CommandOrControl+E',
          click() {
            window.webContents.send(Channel.SHORTCUT, Action.EDIT);
          },
        },
        {
          label: 'Delete Todo',
          accelerator: 'CommandOrControl+D',
          click() {
            window.webContents.send(Channel.SHORTCUT, Action.DELETE);
          },
        },
        {
          label: 'Mark as Done',
          accelerator: 'CommandOrControl+Enter',
          click() {
            window.webContents.send(Channel.SHORTCUT, Action.COMPLETE);
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Remove completed items',
          accelerator: 'CommandOrControl+Shift+D',
          click() {
            window.show();
            window.webContents.send(Channel.SHORTCUT, Action.CLEAR);
          },
        },
        {
          label: 'Remove all items',
          accelerator: 'CommandOrControl+Shift+R',
          click() {
            window.show();
            window.webContents.send(Channel.SHORTCUT, Action.RESET);
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Navigate',
          submenu: [
            'First',
            'Second',
            'Third',
            'Fourth',
            'Fifth',
            'Sixth',
            'Seventh',
            'Eighth',
            'Last',
          ].map((label, i) => ({
            label: `Focus on ${label} Todo`,
            accelerator: `CommandOrControl+${i + 1}`,
            click() {
              window.show();
              window.webContents.send(Channel.SHORTCUT, label.toUpperCase());
            },
          })),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload',
          label: 'Reload',
        },
        {
          type: 'separator',
        },
        {
          role: 'resetzoom',
          label: 'Reset Zoom',
        },
        {
          role: 'zoomin',
          label: 'Zoom In',
        },
        {
          role: 'zoomout',
          label: 'Zoom Out',
        },
        {
          type: 'separator',
        },
      ],
    },
    {
      label: 'Window',
      submenu: [
        {
          role: 'minimize',
          label: 'Minimize',
        },
        {
          role: 'zoom',
          label: 'Zoom',
        },
        ...(isMac
          ? [
              {
                type: 'separator',
              },
              {
                role: 'front',
                label: 'Front',
              },
              {
                type: 'separator',
              },
              {
                role: 'window',
                label: 'Window',
              },
            ]
          : [
              {
                role: 'close',
                label: 'Close',
              },
            ]),
      ],
    },
  ];

  return {
    buildMenu: function () {
      const menu = Menu.buildFromTemplate(
        defaultTemplate as Electron.MenuItemConstructorOptions[]
      );
      Menu.setApplicationMenu(menu);
      return menu;
    },
  };
};

export default MenuBuilder;
