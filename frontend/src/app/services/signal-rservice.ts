import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private isConnected = false;

  constructor() {
    this.createConnection();
    this.startConnection(); // Conectar automáticamente
  }

  private createConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/signalRHub')
      .withAutomaticReconnect() // Reconexión automática
      .build();

    // Eventos de conexión
    this.hubConnection.onclose(() => {
      this.isConnected = false;
      console.log('🔌 Desconectado de SignalR');
    });

    this.hubConnection.onreconnecting(() => {
      console.log('🔄 Reconectando a SignalR...');
    });

    this.hubConnection.onreconnected(() => {
      this.isConnected = true;
      console.log('✅ Reconectado a SignalR');
    });
  }

  async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      this.isConnected = true;
      console.log('✅ Conectado a SignalR');
    } catch (error) {
      this.isConnected = false;
      console.error('❌ Error conectando:', error);
      // Reintentar conexión después de 5 segundos
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  onMessageReceived(callback: (message: string) => void): void {
    this.hubConnection.on('MessageReceived', callback);
  }

  async sendTestMessage(message: string): Promise<void> {
    if (this.isConnected) {
      try {
        await this.hubConnection.invoke('TestConnection', message);
        console.log('📤 Mensaje enviado:', message);
      } catch (error) {
        console.error('❌ Error enviando mensaje:', error);
      }
    } else {
      console.error('❌ No hay conexión');
    }
  }

  get connectionState(): boolean {
    return this.isConnected;
  }

  // Método para desconectar manualmente si es necesario
  async disconnect(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.isConnected = false;
    }
  }
}