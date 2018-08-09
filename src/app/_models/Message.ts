export class Message {
   id: number;
   senderId: number;
   senderKnownAs: string;
   senderPhotoUrl: string;
   recipientId: number;
   recipientKnownAs: string;
   recipienPhotoUrl: string;
   content: string;
   isRead:  boolean;
   dateRead: Date;
   messageSent: Date;
}
