import { get } from 'svelte/store';
import state, { Store } from '../state';

const MOCK_STORE: Store = {
  todos: [],
  theme: {
    title: 'Dark',
    file: 'dark.css',
    primary: '#23282f',
    secondary: '#f0f0f0',
    accent: '#5dbbea',
  },
  newDay: '24:00',
  focus: false,
  updatedAt: new Date('2021-05-29T12:00:00.000Z'),
  expires: new Date('2021-05-30T10:00:00.000Z'),
};

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
  afterEach(() => {
    // reset store
    state.store.set(MOCK_STORE);
  });
  describe('getExpiration', () => {
    it('should return an expiration time 24 hours from now by default', () => {
      const mockTime = state.getExpiration();
      expect(mockTime.expires).toEqual(new Date('2021-05-30T00:00:00.000Z'));
      expect(mockTime.updatedAt).toEqual(new Date(todayMock));
    });
    it('should return an expiration time 6 hours from now', () => {
      state.update({ newDay: '18:00' });
      const mockTime = state.getExpiration();
      expect(mockTime.expires).toEqual(new Date('2021-05-29T18:00:00.000Z'));
      expect(mockTime.updatedAt).toEqual(new Date(todayMock));
    });
    describe('when my expiration time is in the past', () => {
      it('should return an expiration time tomorrow', () => {
        state.update({ newDay: '06:00' });
        const mockTime = state.getExpiration();
        expect(mockTime.expires).toEqual(new Date('2021-05-30T06:00:00.000Z'));
        expect(mockTime.updatedAt).toEqual(new Date(todayMock));
      });
    });
  });
  describe('setTodos', () => {
    it('should store new todos', () => {
      const todoMock = { id: 'abc', text: 'todo', checked: false };
      state.setTodos([todoMock]);
      const currentState = get(state.store);
      expect(currentState.todos).toEqual([todoMock]);
      expect(currentState.updatedAt).toEqual(new Date(todayMock));
      expect(currentState.expires).toEqual(new Date('2021-05-30T00:00:00.000Z'));
    });
  });

  describe('update', () => {
    it('should update state', () => {
      state.update({ newDay: '10:00', focus: true });
      expect(get(state.store)).toEqual({
        todos: [],
        ...MOCK_STORE,
        newDay: '10:00',
        focus: true,
      });
    });

    it('should update localStore', () => {
      state.update({ newDay: '10:00', focus: true });
      expect(JSON.parse(localStorage.getItem(state.key))).toEqual({
        ...MOCK_STORE,
        updatedAt: '2021-05-29T12:00:00.000Z',
        expires: '2021-05-30T10:00:00.000Z',
        newDay: '10:00',
        focus: true,
      });
    });
  });
});
