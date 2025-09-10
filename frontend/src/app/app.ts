import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalRService } from './services/signal-rservice';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  testMessage = '';
  messages: string[] = [];

  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {
    // Escuchar mensajes del servidor
    this.signalRService.onMessageReceived((message: string) => {
      this.messages.push(`📨 ${new Date().toLocaleTimeString()}: ${message}`);
    });
  }

  async connect(): Promise<void> {
    await this.signalRService.startConnection();
  }

  async sendMessage(): Promise<void> {
    if (this.testMessage.trim()) {
      await this.signalRService.sendTestMessage(this.testMessage);
      this.testMessage = '';
    }
  }

  get isConnected(): boolean {
    return this.signalRService.connectionState;
  }
}
