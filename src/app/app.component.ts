import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from './layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Layout],
  template: `
    <layout/>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 't1-frontend';
}
