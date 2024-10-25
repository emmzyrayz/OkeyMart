// utils/mockApi.ts
import {mockChats, mockMessages, mockUsers} from "@/assets/mockdata/product";

export const mockApi = {
  getCurrentUser: () => {
    return Promise.resolve(mockUsers[4]); // Returns the "You" user
  },

  getChats: () => {
    return Promise.resolve(mockChats);
  },

  getChat: (chatId: string) => {
    const chat = mockChats.find((c) => c.id === chatId);
    return Promise.resolve(chat);
  },

  getMessages: (chatId: string) => {
    return Promise.resolve(
      mockMessages[chatId as keyof typeof mockMessages] || []
    );
  },

  sendMessage: (chatId: string, content: string) => {
    const newMessage = {
      id: `m${Date.now()}`,
      content,
      sender: mockUsers[4],
      timestamp: new Date().toISOString(),
    };

    // In a real implementation, you would update the messages array
    // Here we just return the new message
    return Promise.resolve(newMessage);
  },

  // Utility function to simulate API delay
  delay: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
};
