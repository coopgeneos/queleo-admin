export enum AuthState {
  Logged = 'logged',
  NotLogged = 'notLogged',
}

export class AuthUser {
  name: string;
  email: string;
  state: AuthState;
}