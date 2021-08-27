import { v4 as uuidv4 } from 'uuid';
import LocalStore from './store/localStore';

export enum View {
  HOME = 'home',
  SETTINGS_MODAL = 'settings',
  THEME_MODAL = 'theme',
  CUSTOM_THEME_PICKER = 'custom_theme_picker',
}

function getCID(): string {
  const store = new LocalStore<string>('cid');

  if (store.localStore) {
    return store.localStore;
  }

  const newUser = uuidv4();
  store.localStore = newUser;
  return newUser;
}

export function trackView(view: View): void {
  send({ t: 'pageview', dp: view });
}

export function trackEvent(category: string, action: string): void {
  send({
    t: 'event',
    ec: category,
    ea: action,
  });
}

function send(event: Record<string, string>) {
  const payload = {
    v: '1',
    cid: getCID(),
    tid: 'UA-199376250-1',
    ...event,
  };

  fetch('https://google-analytics.com/collect', {
    method: 'POST',
    body: new URLSearchParams(payload).toString(),
  });
}
