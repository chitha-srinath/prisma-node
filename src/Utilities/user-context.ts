import { AsyncLocalStorage } from 'async_hooks';
import { UserDetails, UserSession } from '../interface/user.interface';

// Define the shape of the context
interface UserContextData {
  user: UserDetails;
  session: UserSession;
}

// Singleton AsyncLocalStorage instance
const userContextStorage = new AsyncLocalStorage<UserContextData>();

export const UserContext = {
  run: <T>(context: UserContextData, callback: () => T): T => {
    return userContextStorage.run(context, callback);
  },
  getUser: (): UserDetails | undefined => {
    const store = userContextStorage.getStore();
    return store?.user;
  },
  getSession: (): UserSession | undefined => {
    const store = userContextStorage.getStore();
    return store?.session;
  },
  setUser: (user: UserDetails): void => {
    const store = userContextStorage.getStore();
    if (store && store.user) {
      store.user = user;
    }
  },
  setSession: (session: UserSession): void => {
    const store = userContextStorage.getStore();
    if (store && store.session) {
      store.session = session;
    }
  },
};
