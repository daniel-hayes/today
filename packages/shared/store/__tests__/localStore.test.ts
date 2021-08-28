import LocalStore from '../localStore';
import type { Store } from '../state';

describe('LocalStore', () => {
  const todayMock = '2021-05-29T12:00:00.000Z';
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(todayMock));
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    // to fully reset the state between tests, clear the storage
    localStorage.clear();
    // and reset all mocks
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('returns null if nothing is set in localStorage', () => {
      const state = new LocalStore();
      expect(state.localStore).toBeNull();
    });

    it('gets values from localstorage', () => {
      const state = new LocalStore();

      localStorage.setItem(state.key, JSON.stringify('foo'));

      expect(state.localStore).toEqual('foo');
    });
  });
  describe('set', () => {
    it('should set state', () => {
      const state = new LocalStore();

      const mockStore: Store = {
        todos: [],
        theme: {
          title: 'Dark',
          file: 'bar.css',
          primary: '',
          secondary: '',
          accent: '',
        },
        newDay: '10:00',
        focus: true,
        updatedAt: null,
        expires: null,
      };

      state.localStore = mockStore;

      expect(localStorage.getItem(state.key)).toEqual(JSON.stringify(mockStore));
    });
  });
});
