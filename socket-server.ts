import { Server as socketServer, Socket } from 'socket.io';
import { RoomService } from './src/services/room.service';
import { Server } from 'http';
import { LoggerUtility } from './src/Utilities/LoggerUtility';
import { prismaConnection } from './src/utils/database';

/**
 * Socket.IO server class that handles real-time communication.
 * Manages WebSocket connections, room operations, and message broadcasting.
 */
export class SocketServer {
  private roomService!: RoomService;
  private io: socketServer;
  private readonly logger = LoggerUtility.getInstance(prismaConnection);

  /**
   * Initializes the Socket.IO server with HTTP server and room service.
   * Sets up all socket event handlers for real-time communication.
   * @param httpServer The HTTP server instance to attach Socket.IO to
   */
  constructor(private readonly httpServer: Server) {
    this.io = new socketServer(this.httpServer);
    this.roomService = new RoomService(this.io);
    this.setupSocketHandlers();
  }

  /**
   * Configures all socket event handlers for connection, room operations, and messaging.
   * Handles socket lifecycle events and error scenarios.
   */
  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      // Handle room joining
      socket.on('room:join', (data: { roomId: string }) => {
        try {
          this.roomService.joinRoom(socket, data.roomId);
        } catch (error) {
          this.logger.error(
            `Failed to join room: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
          socket.emit('error', {
            message: 'Failed to join room',
            code: 'ROOM_JOIN_ERROR',
          });
        }
      });

      // Handle room leaving
      socket.on('room:leave', (data: { roomId: string }) => {
        try {
          this.roomService.leaveRoom(socket, data.roomId);
        } catch (error) {
          this.logger.error(
            `Failed to leave room: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
          socket.emit('error', {
            message: 'Failed to leave room',
            code: 'ROOM_LEAVE_ERROR',
          });
        }
      });

      // Handle messages
      socket.on('message:send', (data: { message: string; roomId: string }) => {
        try {
          const messageData = {
            message: data.message,
            from: socket.data.userId,
            timestamp: Date.now(),
          };

          this.roomService.broadcastToRoom(data.roomId, 'message:receive', messageData);
        } catch (error) {
          this.logger.error(
            `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
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
          if (socket.data.rooms) {
            socket.data.rooms.forEach((roomId: string) => {
              this.roomService.leaveRoom(socket, roomId);
            });
          }
        } catch (error) {
          this.logger.error(
            `Error during socket disconnect: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
          );
        }
      });
    });
  }
}
