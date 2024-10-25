"use client";

import {useState, useEffect, useRef} from "react";
import {
  // Message,
   User,
    MessageStatus,
    //  MessageReaction,
      EnhancedMessage,
       AttachmentPreview
      } from "@/types/component";
import { mockApi } from "@/utils/mockApi";
import Image from "next/image";
import { LuCheckCheck, LuCheckCircle2 } from "react-icons/lu";
import { FaFile } from "react-icons/fa";

export default function ChatPage({
  params,
}: {
  params: {messageListId: string; chatId: string};
}) {
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      await mockApi.delay(500);
      const user = await mockApi.getCurrentUser();
      const chatData = await mockApi.getChat(params.chatId);

      if (!chatData) {
        console.error("Chat data not found");
        return;
      }

      const messagesData = await mockApi.getMessages(params.chatId);

      setCurrentUser(user);
      const otherUser = chatData.participants.find((p) => p.id !== user.id);
      setReceiver(otherUser || null);
      // Convert messages to enhanced format
      setMessages(
        messagesData.map((msg) => ({
          ...msg,
          status: "sent",
          reactions: [],
          attachments: [],
        }))
      );
    };

    fetchData();
  }, [params.chatId]);

  // Typing indicator simulation
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    if (receiver) {
      const simulateTyping = () => {
        setIsTyping(true);
        typingTimeout = setTimeout(() => setIsTyping(false), 3000);
      };

      // Simulate receiver typing every 10 seconds
      const interval = setInterval(simulateTyping, 10000);
      return () => {
        clearInterval(interval);
        clearTimeout(typingTimeout);
      };
    }
  }, [receiver]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !fileInputRef.current?.files?.length) return;

    const files = fileInputRef.current?.files;
    const attachments: AttachmentPreview[] = files
      ? Array.from(files).map((file) => ({
          type: file.type.startsWith("image/") ? "image" : "file",
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size, // Include the required size field
        }))
      : [];

    const newMsg: EnhancedMessage = {
      ...(await mockApi.sendMessage(params.chatId, newMessage)),
      content: newMessage,
      // sender: currentUser, // Ensure sender is set correctly
      timestamp: new Date().toISOString(),
      status: "sent",
      reactions: [],
      replyTo: replyingTo || undefined,
      attachments,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
    setReplyingTo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Simulate message status updates
    setTimeout(() => updateMessageStatus(newMsg.id, "delivered"), 1000);
    setTimeout(() => updateMessageStatus(newMsg.id, "read"), 2000);
  };

  const updateMessageStatus = (messageId: string, status: MessageStatus) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? {...msg, status} : msg))
    );
  };

  // const addReaction = (messageId: string, emoji: string) => {
  //   if (!currentUser) return;
  //   setMessages((prev) =>
  //     prev.map((msg) =>
  //       msg.id === messageId
  //         ? {
  //             ...msg,
  //             reactions: [
  //               ...msg.reactions,
  //               {emoji, users: [currentUser.id]}, // Updated to use users array
  //             ],
  //           }
  //         : msg
  //     )
  //   );
  // };
  
  const renderMessageStatus = (status: MessageStatus) => {
    switch (status) {
      case "sent":
        return <LuCheckCircle2 className="w-4 h-4 text-gray-400" />;
      case "delivered":
        return <LuCheckCheck className="w-4 h-4 text-gray-400" />;
      case "read":
        return <LuCheckCheck className="w-4 h-4 text-blue-400" />;
    }
  };

  const renderAttachmentPreview = (attachment: AttachmentPreview) => (
    <div className="mt-2 p-2 bg-gray-700 rounded-lg flex items-center">
      {attachment.type === "image" ? (
        <Image
          src={attachment.url}
          alt={attachment.name}
          width={200}
          height={150}
          className="rounded-lg"
        />
      ) : (
        <div className="flex items-center">
          <FaFile className="w-6 h-6 mr-2" />
          <span className="text-sm">{attachment.name}</span>
        </div>
      )}
    </div>
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <div className="flex items-center flex-1">
          <Image
            src={receiver?.avatar || "/placeholder-avatar.png"}
            alt={`${receiver?.name || "User"} avatar`}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-3">
            <h2 className="font-medium text-white">
              {receiver?.name || "Loading..."}
            </h2>
            <p className="text-sm text-gray-400">
              {receiver?.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="text-gray-400 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => {
          const isCurrentUser = message.sender.id === currentUser?.id;
          return (
            <div
              key={message.id}
              className={`flex mb-4 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* Show avatar for received messages */}
              {!isCurrentUser && (
                <Image
                  src={message.sender.avatar}
                  alt={`${message.sender.name}'s avatar`}
                  width={32}
                  height={32}
                  className="rounded-full mr-2 self-end"
                />
              )}

              <div className="flex flex-col max-w-[70%]">
                {message.replyTo && (
                  <div className="text-xs text-gray-400 mb-1 ml-3">
                    Replying to{" "}
                    {messages
                      .find((m) => m.id === message.replyTo)
                      ?.content.substring(0, 20)}
                    ...
                  </div>
                )}

                <div
                  className={`relative rounded-lg p-3 ${
                    isCurrentUser
                      ? "bg-blue-500 text-white rounded-tr-none"
                      : "bg-gray-800 text-white rounded-tl-none"
                  }`}
                >
                  {/* Sender name for received messages */}
                  {!isCurrentUser && (
                    <p className="text-xs text-gray-400 mb-1">
                      {message.sender.name}
                    </p>
                  )}
                  <p className="break-words">{message.content}</p>

                  {message.attachments?.map((attachment: AttachmentPreview, index) => (
                    <div key={index}>{renderAttachmentPreview(attachment)}</div>
                  ))}

                  <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                    <span>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isCurrentUser && (
                      <span className="ml-2">
                        {renderMessageStatus(message.status)}
                      </span>
                    )}
                  </div>
                </div>
                {message.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {Array.from(
                      new Set(message.reactions.map((r) => r.emoji))
                    ).map((emoji) => (
                      <span
                        key={emoji}
                        className="bg-gray-800 rounded-full px-2 py-1 text-sm"
                      >
                        {emoji}{" "}
                        {
                          message.reactions.filter((r) => r.emoji === emoji)
                            .length
                        }
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Show avatar for sent messages */}
              {isCurrentUser && (
                <Image
                  src={currentUser.avatar}
                  alt="Your avatar"
                  width={32}
                  height={32}
                  className="rounded-full ml-2 self-end"
                />
              )}
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-center text-gray-400 text-sm">
            <div className="animate-pulse">typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {replyingTo && (
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Replying to:{" "}
            {messages
              .find((m) => m.id === replyingTo)
              ?.content.substring(0, 50)}
            ...
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Message input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-800"
      >
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={() => {}} // Handle file selection if needed
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
