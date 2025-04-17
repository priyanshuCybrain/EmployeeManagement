import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Use CommonModule instead of BrowserModule
import { MatDialogModule } from '@angular/material/dialog'; // ✅ Import this
import { MatButtonModule } from '@angular/material/button'; // ✅ Import this
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatDialogModule, // ✅ Import this
    MatButtonModule,
  ], // Use CommonModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
