import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtService<T> {
  private tokenKey = 'auth_token';

  constructor() {}

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const expiry = this.getTokenExpirationDate();
    return expiry ? expiry <= new Date() : true;
  }

  decodeToken(): T | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(this.base64UrlDecode(payload));
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  getTokenExpirationDate(): Date | null {
    const decoded = this.decodeToken() as T extends { exp: number } ? T : null;
    if (!decoded || !decoded.exp) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  private base64UrlDecode(input: string): string {
    input = input.replace(/-/g, '+').replace(/_/g, '/');
    while (input.length % 4) {
      input += '=';
    }
    return atob(input);
  }
}
