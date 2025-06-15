import { Server, Socket } from 'socket.io';

type SocketEvent = string;
type SocketData = unknown;

export class RoomService {
  private rooms: Map<string, Set<string>> = new Map();

  constructor(private io: Server) {}

  joinRoom(socket: Socket, roomId: string): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    const room = this.rooms.get(roomId);
    if (!room) return;

    room.add(socket.data.userId);
    socket.data.rooms.add(roomId);

    socket.join(roomId);

    this.io.to(roomId).emit('room:joined', {
      roomId,
      users: Array.from(room),
    });
  }

  leaveRoom(socket: Socket, roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.delete(socket.data.userId);
    socket.data.rooms.delete(roomId);

    if (room.size === 0) {
      this.rooms.delete(roomId);
    }

    socket.leave(roomId);

    this.io.to(roomId).emit('room:left', {
      roomId,
      users: Array.from(room),
    });
  }

  getRoomUsers(roomId: string): string[] {
    return Array.from(this.rooms.get(roomId) || new Set());
  }

  broadcastToRoom(roomId: string, event: SocketEvent, data: SocketData): void {
    this.io.to(roomId).emit(event, data);
  }
}
