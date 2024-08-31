import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/partials/header/header.component";
import { RouterModule } from '@angular/router';
import { HomeComponent } from "./components/pages/home/home.component";
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "./components/partials/loading/loading.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, RouterModule, HomeComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
