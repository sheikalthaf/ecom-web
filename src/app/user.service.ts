import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDetails, User } from './models/user';

export interface RegisterUser {
  Name: string;
  MobileNo: string;
  Email: string;
  Password: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string) {
    return this.http.post<{ token: LoginDetails }>('/authenticate', {
      username,
      password,
    });
  }

  register(user: RegisterUser) {
    return this.http.post('/register', user);
  }

  getUsers() {
    return this.http.get('/users');
  }

  getUser(id: string) {
    return this.http.get(` /users/${id}`);
  }
}
