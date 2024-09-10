import { Component, inject, signal } from '@angular/core';
import { UserState } from './store/user.store';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  Button,
  DialogRef,
  Input,
  Label,
  Selectable,
  SelectableItem,
  Spinner,
} from '@meeui/ui';
import { UserService } from './user.service';
import { JwtService } from './jwt.service';
import { User } from './models/user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    Button,
    Input,
    Label,
    Selectable,
    SelectableItem,
    Spinner,
  ],
  template: `
    <mee-selectable [(activeIndex)]="activeTab" class="mb-b4 w-full">
      <mee-selectable-item value="login">Login</mee-selectable-item>
      <mee-selectable-item value="register">Register</mee-selectable-item>
    </mee-selectable>

    @if (activeTab() === 'login') {
      @if (invalidCredentials()) {
        <div class="text-red-500">Invalid credentials</div>
      }
      <form [formGroup]="loginForm" (ngSubmit)="login()">
        <label meeLabel>
          Username
          <input meeInput formControlName="username" />
        </label>
        <label meeLabel>
          Password
          <input meeInput type="password" formControlName="password" />
        </label>

        <button
          meeButton
          variant="primary"
          type="submit"
          [disabled]="loading()"
        >
          @if (loading()) {
            <mee-spinner [diameter]="16" class="mr-2" />
          }
          Login
        </button>
      </form>
    } @else {
      <form [formGroup]="registerForm" (ngSubmit)="register()">
        <label meeLabel>
          Name
          <input meeInput formControlName="name" />
        </label>
        <label meeLabel>
          Mobile No
          <input meeInput formControlName="mobileNo" />
        </label>
        <label meeLabel>
          Email
          <input meeInput formControlName="email" />
        </label>
        <label meeLabel>
          Password
          <input meeInput type="password" formControlName="password" />
        </label>
        <button
          meeButton
          variant="primary"
          type="submit"
          [disabled]="loading()"
        >
          @if (loading()) {
            <mee-spinner [diameter]="16" class="mr-2" />
          }
          Register
        </button>
      </form>
    }
  `,
  host: {
    class: 'block p-b4',
  },
})
export class LoginComponent {
  readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(DialogRef);
  readonly jwtService = inject<JwtService<User>>(JwtService);
  readonly activeTab = signal<'login' | 'register'>('login');
  readonly loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  readonly registerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    mobileNo: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  private userStore = inject(UserState);
  private userService = inject(UserService);

  loading = signal(false);
  invalidCredentials = signal(false);

  login() {
    const { username, password } = this.loginForm.value;
    this.loading.set(true);
    this.authenticate(username!, password!);
  }

  authenticate(username: string, password: string) {
    this.userService.authenticate(username, password).subscribe({
      next: (user) => {
        this.userStore.setAccessToken(user.token.AccessToken);
        const userData = this.jwtService.decodeToken();
        this.jwtService.setToken(user.token.AccessToken);
        this.userStore.setUser(userData!);
        this.loading.set(false);
        this.dialogRef.close();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.invalidCredentials.set(true);
        }
        this.loading.set(false);
      },
    });
  }

  register() {
    this.loading.set(true);
    const { name, mobileNo, email, password } = this.registerForm.value;
    this.userService
      .register({
        Name: name!,
        MobileNo: mobileNo!,
        Email: email!,
        Password: password!,
      })
      .subscribe({
        next: () => {
          this.authenticate(mobileNo!, password!);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
