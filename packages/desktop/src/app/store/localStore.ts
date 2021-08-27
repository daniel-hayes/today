class LocalStore<S> {
  key = 'store';

  constructor(key?: string) {
    this.key = key || this.key;
  }

  get localStore(): S | null {
    const store = localStorage.getItem(this.key);

    if (localStorage) {
      return JSON.parse(store);
    }

    return null;
  }

  set localStore(value: S) {
    localStorage.setItem(this.key, JSON.stringify(value));
  }
}

export default LocalStore;
