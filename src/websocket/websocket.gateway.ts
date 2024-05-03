import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('friend request')
  handleFriendRequest(
    client: any,
    @MessageBody()
    payload: { changerNickname: string; changeeNickname: string },
  ): void {
    const { changerNickname, changeeNickname } = payload;

    this.server.emit('friend request result', changerNickname, changeeNickname);
  }
}
