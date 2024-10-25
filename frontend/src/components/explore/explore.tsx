"use client";
import React, {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaPaperclip,
  FaPlus,
  FaCircleUser,
  // FaShareFromSquare,
  FaRegShareFromSquare,
} from "react-icons/fa6";
import {FaGlobeAmericas} from "react-icons/fa";
import {
  // BiLike,
   BiSolidLike, 
   BiComment,
    // BiSolidComment
  } from "react-icons/bi";
import {GoDotFill} from "react-icons/go";
import {BsThreeDots,
  //  BsFillPinAngleFill
  } from "react-icons/bs";
import {IoSend, 
  // IoSendOutline
} from "react-icons/io5";
import {WaveInput} from "../input/waveinput";
import {Chat, User} from "@/types/component";

interface StatusItemProps {
  isCreate?: boolean;
  userName?: string;
  imageUrl: string; // This is required since we always need an image
}

interface BlogPostProps {
  userName: string;
  title: string;
  postTime: string;
  hashTag: string;
  imageUrl: string;
  text: string;
  likeCount: string;
  commentCount: number;
}

interface MessageTabProps {
  chat: Chat;
  currentUser: User | null;
}

const UserImg =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const StatusItem: React.FC<StatusItemProps> = ({
  isCreate = false,
  userName = "John Doe",
  imageUrl,
}) => {
  if (isCreate) {
    return (
      <div
        className="status_post flex-shrink-0 flex flex-col h-full w-[160px] rounded-xl shadow relative items-center justify-end cursor-pointer hover:opacity-95 transition-opacity"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="status_post_btm relative flex flex-col items-center justify-center w-full h-[33%] bg-[--blur] backdrop-blur-sm rounded-b-xl">
          <div className="status_post_btm_btn flex justify-center items-center text-[26px] absolute top-[-20px] rounded-full bg-blue-500 text-[--text] p-2 hover:bg-blue-600 transition-colors">
            <FaPlus />
          </div>
          <div className="status_post_btm_txt text-[--text] text-[18px] font-medium -mb-4">
            Create Story
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="status_item flex-shrink-0 flex flex-col items-center justify-end relative h-full w-[160px] rounded-xl shadow hover:opacity-95 transition-opacity cursor-pointer"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="status_item_user absolute flex text-[26px] top-2 left-2 border-[2px] border-[--button1] bg-[--text1] rounded-full text-[--secondary1]">
        <FaCircleUser />
      </div>
      <div className="status_item_name mb-3 text-[18px] font-medium text-[--text] drop-shadow-lg">
        <span>{userName}</span>
      </div>
    </div>
  );
};

const BlogPostItem: React.FC<BlogPostProps> = ({
  title,
  userName,
  imageUrl,
  postTime,
  text,
  hashTag,
  likeCount,
  commentCount,
}) => {
  return (
    <div className="exp_blog_item bg-[rgba(255,255,255,0.2)] rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-[rgba(0,0,0,0.1)] p-6 shadow-lg">
      <div className="blog_top flex flex-row items-center justify-between">
        <div className="blog_top_user flex flex-row gap-3 items-center justify-start">
          <div className="blog_top_img text-[32px] text-[--text] hover:text-[--text1] cursor-pointer">
            <FaCircleUser />
          </div>
          <div className="blog_top_det flex flex-col group cursor-pointer">
            <div className="blog_user_name text-[14px] font-medium text-[--text] group-hover:text-[--text1]">
              {userName}
            </div>
            <div className="blog_user_info flex flex-row items-center justify-center gap-[2px] text-[--text] group-hover:text-[--text1]">
              <div className="blog_post_time text-[12px] font-light ">
                <span>{postTime}</span>
              </div>
              <GoDotFill className="text-[10px]" />
              <FaGlobeAmericas className="text-[--text] opacity-40 text-[16px]" />
            </div>
          </div>
        </div>
        <div className="blog_top_menu flex items-center justify-center text-[22px] text-[--text] hover:text-[--text1] cursor-pointer">
          <BsThreeDots />
        </div>
      </div>
      <div className="blog_body">
        <div className="blog_body_text flex flex-col items-start justify-center gap-1">
          <div className="blog_title text-[--text] text-[20px] font-semibold">
            <span>{title}</span>
          </div>
          <div className="blog_hastag text-blue-600 text-[16px] font-normal">
            {hashTag}
          </div>
          <div className="blog_text text-[--text] text-[16px] font-medium">
            {text}
          </div>
          <button className="blog_readme text-blue-600 text-[16px] font-normal cursor-pointer">
            Read more...
          </button>
        </div>
        <div className="blog_body_img flex w-full h-[300px]">
          <Image src={imageUrl} width={300} height={500} alt={userName} className="flex object-center w-full h-full rounded-lg" />
        </div>
      </div>
      <div className="blog_bottom">
        <div className="blog_bottom_body flex flex-row items-center justify-between p-2">
          <div className="blog_bottom_react flex flex-row items-center gap-1">
            <div className="blog_bottom_icons bg-blue-500 hover:bg-blue-600 flex p-1 opacity-95 rounded-full text-[--text] ">
              <div className="blog_bottom_icon">
                <BiSolidLike />
              </div>
            </div>
            <span className="text-[14px] font-normal text-[--text]">
              {likeCount}
            </span>
          </div>
          <div className="blog_bottom_comment">
            <span className="text-[--text] font-normal text-[16px]">
              {commentCount} Comments
            </span>
          </div>
        </div>
        <div className="blog_bottom_btns flex flex-row items-center justify-between">
          <div className="blog_like_btn flex flex-row items-center justify-center gap-1 w-1/4 bg-blue-500 hover:bg-blue-400 p-2 rounded-3xl text-[--text] cursor-pointer">
            <BiSolidLike className="text-[18px]" />
            <span className="text-[18px]">Like</span>
          </div>
          <div className="blog_comment_btn flex flex-row items-center justify-center gap-1 w-1/4 hover:bg-gray-500 hover:text-[--text] p-2 rounded-3xl cursor-pointer">
            <BiComment className="text-[18px]" />
            <span className="text-[18px]">Comment</span>
          </div>
          <div className="blog_share_btn flex flex-row items-center justify-center gap-1 w-1/4 hover:bg-gray-500 hover:text-[--text] cursor-pointer p-2 rounded-3xl">
            <FaRegShareFromSquare className="text-[18px]" />
            <span className="text-[18px]">Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExpStatus = () => {
  const statusItems = Array(11).fill({
    userName: "John Doe",
    imageUrl: UserImg, // Replace with your image import
  });

  return (
    <div className="exp_status_container p-1 mb-4">
      <div className="exp_status_cont">
        <div className="status_items h-[250px] flex flex-row gap-3 overflow-x-auto">
          {/* Create Story item */}
          <StatusItem isCreate={true} imageUrl={UserImg} />

          {/* Status items */}
          {statusItems.map((item, index) => (
            <StatusItem
              key={index}
              userName={item.userName}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ExpPost = () => {
  const [inputValue, setInputValue] = useState("");

  // Change handler for the input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="exp_post_container flex flex-row items-center justify-center mb-4 gap-8 w-full h-[60px] bg-[rgba(0,0,0,0.2)] rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-50 border border-[rgba(255,255,255,0.2)]">
      <div className="exp_post_img flex items-end justify-center text-[--text1] text-[30px] rounded-full">
        <FaCircleUser />
      </div>
      <div className="exp_post_input flex w-[300px] items-center justify-center -mb-8">
        <WaveInput
          label="Whats_on_your_mind ?"
          name="name"
          type="text"
          required
          value={inputValue} // Use the state variable here
          onChange={handleInputChange}
        />
      </div>
      <div className="exp_post_btn flex flex-row gap-4 text-[28px]">
        <FaPaperclip className="text-[--text1]" />
        <IoSend className="text-[--text1]" />
      </div>
    </div>
  );
};

export const ExpBlog = () => {
  const BlogPostItems = Array(11).fill({
    title: "How to boost your Products",
    userName: "Getziyal",
    imageUrl: UserImg,
    postTime: "30m",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam possimus quod beatae reprehenderit dolores maxime dolorem, quaerat velit qui obcaecati alias voluptates, veritatis quam magnam iure iusto, placeat quasi debitis optio voluptas. Repellat commodi cum voluptatibus, tempora nisi ab fuga veritatis, eius autem ut beatae suscipit fugiat sit aut et ipsa aliquam perspiciatis, doloremque debitis facilis laudantium? Earum, doloribus ea?",
    hashTag: "#electronic #gadgets #laptop #discussion",
    likeCount: "You & 2 others",
    commentCount: "2", // Replace with your image import
  });
  return (
    <div className="exp_blog_container">
      <div className="exp_blog_items flex flex-col items-center justify-start flex-nowrap bg-[rgba(0,0,0,0.2)] rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 border border-[rgba(255,255,255,0.1)] p-6 shadow-lg gap-3 h-[420px] md:h-[520px] lg:h-[620px] overflow-y-auto">
        {/* Blog Post Items */}
        {BlogPostItems.map((item, index) => (
          <BlogPostItem key={index} userName={item.userName} postTime={item.postTime} title={item.title} hashTag={item.hashTag} text={item.text} likeCount={item.likeCount} commentCount={item.commentCount} imageUrl={item.imageUrl} />
        ))}
        <div className="exp_blog_item bg-[rgba(255,255,255,0.2)] rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-[rgba(0,0,0,0.1)] p-6 shadow-lg">
          <div className="blog_top flex flex-row items-center justify-between">
            <div className="blog_top_user flex flex-row gap-3 items-center justify-start">
              <div className="blog_top_img text-[32px] text-[--text] hover:text-[--text1] cursor-pointer">
                <FaCircleUser />
              </div>
              <div className="blog_top_det flex flex-col group cursor-pointer">
                <div className="blog_user_name text-[14px] font-medium text-[--text] group-hover:text-[--text1]">
                  Getziyal
                </div>
                <div className="blog_user_info flex flex-row items-center justify-center gap-[2px] text-[--text] group-hover:text-[--text1]">
                  <div className="blog_post_time text-[12px] font-light ">
                    <span>30m</span>
                  </div>
                  <GoDotFill className="text-[10px]" />
                  <FaGlobeAmericas className="text-[--text] opacity-40 text-[16px]" />
                </div>
              </div>
            </div>
            <div className="blog_top_menu flex items-center justify-center text-[22px] text-[--text] hover:text-[--text1] cursor-pointer">
              <BsThreeDots />
            </div>
          </div>
          <div className="blog_body">
            <div className="blog_body_text flex flex-col items-start justify-center gap-1">
              <div className="blog_title text-[--text] text-[20px] font-semibold">
                <span>How to boost your Products</span>
              </div>
              <div className="blog_hastag text-blue-600 text-[16px] font-normal">
                #electronic #gadgets #laptop #discussion
              </div>
              <div className="blog_text text-[--text] text-[16px] font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                possimus quod beatae reprehenderit dolores maxime dolorem,
                quaerat velit qui obcaecati alias voluptates, veritatis quam
                magnam iure iusto, placeat quasi debitis optio voluptas.
                Repellat commodi cum voluptatibus, tempora nisi ab fuga
                veritatis, eius autem ut beatae suscipit fugiat sit aut et ipsa
                aliquam perspiciatis, doloremque debitis facilis laudantium?
                Earum, doloribus ea?
              </div>
              <button className="blog_readme text-blue-600 text-[16px] font-normal">
                Read more...
              </button>
            </div>
            <div className="blog_body_img"></div>
          </div>
          <div className="blog_bottom">
            <div className="blog_bottom_body flex flex-row items-center justify-between p-2">
              <div className="blog_bottom_react flex flex-row items-center gap-1">
                <div className="blog_bottom_icons bg-blue-500 flex p-1 rounded-full text-[--text] ">
                  <div className="blog_bottom_icon">
                    <BiSolidLike />
                  </div>
                </div>
                <span className="text-[14px] font-normal text-[--text]">
                  You & 1 other
                </span>
              </div>
              <div className="blog_bottom_comment">
                <span className="text-[--text] font-normal text-[16px]">
                  0 Comments
                </span>
              </div>
            </div>
            <div className="blog_bottom_btns flex flex-row items-center justify-between">
              <div className="blog_like_btn flex flex-row items-center justify-center gap-1 w-1/4 bg-blue-500 hover:bg-blue-400 p-2 rounded-3xl text-[--text] cursor-pointer">
                <BiSolidLike className="text-[18px]" />
                <span className="text-[18px]">Like</span>
              </div>
              <div className="blog_comment_btn flex flex-row items-center justify-center gap-1 w-1/4 hover:bg-gray-500 hover:text-[--text] p-2 rounded-3xl cursor-pointer">
                <BiComment className="text-[18px]" />
                <span className="text-[18px]">Comment</span>
              </div>
              <div className="blog_share_btn flex flex-row items-center justify-center gap-1 w-1/4 hover:bg-gray-500 hover:text-[--text] cursor-pointer p-2 rounded-3xl">
                <FaRegShareFromSquare className="text-[18px]" />
                <span className="text-[18px]">Share</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SellShop = () => {

  const products = [
    // Sample product data
    {id: 1, name: "Product 1", price: "$10", image: UserImg},
    {id: 2, name: "Product 2", price: "$20", image: UserImg},
    // Add more products as needed
  ];

  const [inputValue, setInputValue] = useState("");

  // Change handler for the input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="sell_shop">
      <main className="flex-1 p-4">
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="input flex flex-row items-center w-[50%] ">
            <WaveInput
              label="Search_Product..."
              name="name"
              type="text"
              required
              value={inputValue} // Use the state variable here
              onChange={handleInputChange}
            />
          </div>
          <button className="bg-blue-500 text-white p-2 rounded">
            Add Product
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded shadow-md">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={600}
                className="w-full h-[300px] object-fill rounded"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.price}</p>
              <div className="flex justify-between mt-4">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-white p-2 rounded">
                  Modify
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white p-2 rounded">
                  Delete
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded">
                  Statistics
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}



export const MessageTab = ({chat, currentUser}: MessageTabProps) => {
  const otherParticipant = chat.participants.find(
    (p) => p.id !== currentUser?.id
  );

  return (
    <Link href={`/message/${currentUser?.id}/${chat.id}`}>
      <div className="flex items-center p-4 hover:bg-gray-800 cursor-pointer">
        <div className="relative">
          <Image
            src={otherParticipant?.avatar || ""}
            alt={otherParticipant?.name || ""}
            width={40}
            height={40}
            className="rounded-full w-[50px] h-[50px]"
          />
          {otherParticipant?.online && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
          )}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{otherParticipant?.name}</h3>
            <span className="text-sm text-gray-400">
              {chat.lastMessage?.timestamp}
            </span>
          </div>
          <p className="text-sm w-[300px] text-gray-400 truncate">
            {chat.lastMessage?.content}
          </p>
        </div>
        {chat.unreadCount ? (
          <div className="ml-2 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {chat.unreadCount}
          </div>
        ) : null}
      </div>
    </Link>
  );
};