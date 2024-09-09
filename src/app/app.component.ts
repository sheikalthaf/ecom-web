import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<az-header></az-header>
    <router-outlet></router-outlet> `,
  imports: [RouterOutlet, HeaderComponent],
})
export class AppComponent {
  title = 'ecom';
}
