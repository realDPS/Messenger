import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const chatPageGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem("username") != null) {
    return true; 
  } else {
    return inject(Router).parseUrl("/");
  }
};
