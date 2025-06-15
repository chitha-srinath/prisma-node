import { Server as socketServer, Socket } from 'socket.io';
import { RoomService } from './src/services/room.service';
import { Server } from 'http';

export class SocketServer {
  private roomService!: RoomService;
  private io: socketServer;

  constructor(private readonly httpServer: Server) {
    this.io = new socketServer(this.httpServer);
    this.roomService = new RoomService(this.io);
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      // Handle room joining
      socket.on('room:join', (data) => {
        try {
          this.roomService.joinRoom(socket, data.roomId);
        } catch (error) {
          console.error(error);
          socket.emit('error', {
            message: 'Failed to join room',
            code: 'ROOM_JOIN_ERROR',
          });
        }
      });

      // Handle room leaving
      socket.on('room:leave', (data) => {
        try {
          this.roomService.leaveRoom(socket, data.roomId);
        } catch (error) {
          console.error(error);
          socket.emit('error', {
            message: 'Failed to leave room',
            code: 'ROOM_LEAVE_ERROR',
          });
        }
      });

      // Handle messages
      socket.on('message:send', (data) => {
        try {
          const messageData = {
            message: data.message,
            from: socket.data.userId,
            timestamp: Date.now(),
          };

          this.roomService.broadcastToRoom(data.roomId, 'message:receive', messageData);
        } catch (error) {
          console.error(error);
          socket.emit('error', {
            message: 'Failed to send message',
            code: 'MESSAGE_SEND_ERROR',
          });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        try {
          // Leave all rooms
          socket.data.rooms.forEach((roomId: string) => {
            this.roomService.leaveRoom(socket, roomId);
          });
        } catch (error) {
          console.error(error);
        }
      });
    });
  }
}
