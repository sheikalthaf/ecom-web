import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { User } from '../models/user';

interface UserDetails {
  user?: User;
}

const initialState: UserDetails = {
  user: undefined,
};

export const UserState = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setUser: (user: User) => patchState(store, (state) => ({ ...state, user })),
    setAccessToken: (accessToken: string) =>
      patchState(store, (state) => ({ ...state, accessToken })),
  })),
  withComputed(({ user }) => ({
    user: computed(() => user?.()),
  })),
);
