"use client";

import {useState, useEffect} from "react";
import {MessageTab} from "@/components/explore/explore";
import {Chat, User} from "@/types/component";

export default function MessageList({
  params,
}: {
  params: {messageListId: string};
}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch chats for the current user
    const fetchChats = async () => {
      // Replace with your actual API call
      const response = await fetch(`/api/chats/${params.messageListId}`);
      const data = await response.json();
      setChats(data.chats);
    };

    const fetchCurrentUser = async () => {
      const response = await fetch(`/api/users/current`);
      const data = await response.json();
      setCurrentUser(data.user); // Set the current user
    };

    fetchChats();
    fetchCurrentUser();
  }, [params.messageListId]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-800">
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-800 rounded-lg px-4 py-2 pl-10"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Chat list */}
        <div className="overflow-y-auto">
          {chats.map((chat) => (
            <MessageTab key={chat.id} chat={chat} currentUser={currentUser} />
          ))}
        </div>
      </div>
    </div>
  );
}
