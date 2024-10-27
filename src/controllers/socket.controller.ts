import { Socket } from 'socket.io';
import Messages from '../models/messages.model';

class SocketController {
    private socket: Socket;
    private static users: { [userId: string]: Socket } = {};

    constructor(socket: Socket) {
        this.socket = socket;
        this.setupListeners = this.setupListeners.bind(this);
    }

    private setupListeners() {

        this.socket.on('registerUser', (userId: string) => {
            SocketController.users[userId] = this.socket;
            console.log(`User registered: ${userId} with socket ID: ${this.socket.id}`);
        });

        this.socket.on('sendMessage', async (data) => {
            try {
                const message = await Messages.create({
                    message: data.message,
                    chatId: data.chatId,
                });

                const recipientSocket = SocketController.users[data.recipientId];
                if (recipientSocket) {
                    recipientSocket.emit('receiveMessage', message);
                }
                this.socket.emit('messageSaved', message);
            } catch (error) {
                console.error('Error saving message:', error);
                this.socket.emit('error', 'Failed to save message.');
            }
        });

        this.socket.on('disconnect', () => {
            for (const userId in SocketController.users) {
                if (SocketController.users[userId].id === this.socket.id) {
                    delete SocketController.users[userId];
                    console.log(`User disconnected: ${userId}`);
                }
            }
        });
    }
}

export default SocketController;
