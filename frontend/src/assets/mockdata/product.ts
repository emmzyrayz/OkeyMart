// mockdata/users.ts
export const mockUsers = [
  {
    id: "u1",
    name: "John Smith",
    avatar:
      "https://images.unsplash.com/photo-1685903772095-f07172808761?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    online: true,
  },
  {
    id: "u2",
    name: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1702482527875-e16d07f0d91b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    online: false,
  },
  {
    id: "u3",
    name: "Mike Johnson",
    avatar:
      "https://images.unsplash.com/photo-1678286742832-26543bb49959?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    online: true,
  },
  {
    id: "u4",
    name: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1678286742832-26543bb49959?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    online: true,
  },
  {
    id: "current",
    name: "You",
    avatar:
      "https://images.unsplash.com/photo-1678286742832-26543bb49959?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    online: true,
  },
] as const;

// mockData/products.ts
export const mockProducts = [
  {
    id: "p1",
    name: "Wireless Headphones",
    price: 199.99,
    seller: mockUsers[0],
  },
  {
    id: "p2",
    name: "Smartphone",
    price: 699.99,
    seller: mockUsers[1],
  },
  {
    id: "p3",
    name: "Laptop",
    price: 1299.99,
    seller: mockUsers[2],
  },
] as const;

// mockData/messages.ts
export const mockMessages = {
  chat1: [
    {
      id: "m1",
      content:
        "Hi, I'm interested in the wireless headphones. Are they still available?",
      sender: mockUsers[4], // current user
      timestamp: "2024-02-20T10:00:00Z",
    },
    {
      id: "m2",
      content:
        "Yes, they are available! They're brand new and come with a 1-year warranty.",
      sender: mockUsers[0],
      timestamp: "2024-02-20T10:05:00Z",
    },
    {
      id: "m3",
      content: "Great! What's the battery life like?",
      sender: mockUsers[4],
      timestamp: "2024-02-20T10:07:00Z",
    },
    {
      id: "m4",
      content:
        "The battery lasts up to 30 hours on a single charge, and it has quick charging - 5 minutes gives you 2 hours of playback.",
      sender: mockUsers[0],
      timestamp: "2024-02-20T10:10:00Z",
    },
  ],
  chat2: [
    {
      id: "m5",
      content: "Hello, is the smartphone still available?",
      sender: mockUsers[4],
      timestamp: "2024-02-19T15:00:00Z",
    },
    {
      id: "m6",
      content: "Yes, it is! Are you interested in buying?",
      sender: mockUsers[1],
      timestamp: "2024-02-19T15:30:00Z",
    },
  ],
  chat3: [
    {
      id: "m7",
      content: "Is the laptop available for pickup today?",
      sender: mockUsers[4],
      timestamp: "2024-02-18T09:00:00Z",
    },
    {
      id: "m8",
      content: "Yes, you can pick it up anytime between 2-6 PM",
      sender: mockUsers[2],
      timestamp: "2024-02-18T09:15:00Z",
    },
  ],
};

// mockData/chats.ts
export const mockChats = [
  {
    id: "chat1",
    participants: [mockUsers[0], mockUsers[4]],
    lastMessage: mockMessages["chat1"][mockMessages["chat1"].length - 1],
    unreadCount: 1,
    productId: "p1",
  },
  {
    id: "chat2",
    participants: [mockUsers[1], mockUsers[4]],
    lastMessage: mockMessages["chat2"][mockMessages["chat2"].length - 1],
    unreadCount: 0,
    productId: "p2",
  },
  {
    id: "chat3",
    participants: [mockUsers[2], mockUsers[4]],
    lastMessage: mockMessages["chat3"][mockMessages["chat3"].length - 1],
    unreadCount: 2,
    productId: "p3",
  },
];
