import { Injectable } from '@angular/core';

@Injectable()
export class IAMService {

  constructor() {}

  // set the current user in localStorages
  setCurrentUser(user_id) {
    if (user_id == null) {
      localStorage.clear();
    } else {
      localStorage.setItem('user_id', user_id);
    }
  }

  // retrieve the current user from localStorage
  getCurrentUser() {
    return localStorage.getItem('user_id');
  }
}