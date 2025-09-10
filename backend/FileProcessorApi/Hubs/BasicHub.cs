using Microsoft.AspNetCore.SignalR;

// Hub más básico posible - IMPORTANTE: debe heredar de Hub
public class BasicHub : Hub
{
    // Método que confirma que el servidor recibe mensajes
    public async Task TestConnection(string message)
    {
        // Simplemente reenvía el mensaje a todos los conectados
        await Clients.All.SendAsync("MessageReceived", $"Servidor dice: {message}");
    }
}