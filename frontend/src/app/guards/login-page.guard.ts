import { CanActivateFn } from '@angular/router';

export const loginPageGuard: CanActivateFn = (route, state) => {
  return true;
};
