// types/components.ts
export interface WaveInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  error?: string;
}

export interface WaveSelectOption {
  value: string;
  label: string;
}

export interface WaveSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: WaveSelectOption[];
  required?: boolean;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: string;
  attachments?: Array<{
    type: "image" | "file";
    url: string;
    name?: string;
  }>;
  reactions?: Array<{
    emoji: string;
    users: string[];
  }>;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount?: number;
  productId?: string;
}

export type MessageStatus = "sent" | "delivered" | "read";

export type MessageReaction = {
  emoji: string;
  users: string[];
}

export type AttachmentPreview = {
  type: "image" | "file";
  url: string;
  name: string;
  size: number;
};

export type EnhancedMessage = Message & {
  status: MessageStatus;
  reactions: MessageReaction[];
  replyTo?: string;
  attachments?: AttachmentPreview[];
};