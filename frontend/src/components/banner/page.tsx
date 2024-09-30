'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import "./banner.css";
import Image from "next/image";
import {FaApple, FaArrowRight} from "react-icons/fa6";
import Banner1 from "../../assets/img/banner/iphone14.jpg";

interface BannerProps {
  className?: string;
}

const banners = [
  {
    id: 1,
    title: "iPhone 14 Series",
    offer: "Up to 10% off Voucher",
    image: Banner1,
  },
  {
    id: 2,
    title: "iPhone 142 Series",
    offer: "Up to 10% off Voucher",
    image: Banner1,
  },
  {
    id: 3,
    title: "iPhone 143 Series",
    offer: "Up to 10% off Voucher",
    image: Banner1,
  },
  {
    id: 4,
    title: "iPhone 144 Series",
    offer: "Up to 10% off Voucher",
    image: Banner1,
  },
  {
    id: 5,
    title: "iPhone 145 Series",
    offer: "Up to 10% off Voucher",
    image: Banner1,
  },
];


export const Banner: React.FC<BannerProps> = ({className}) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  // Handle banner sliding
  useEffect(() => {
    const interval = setInterval(() => {
      // Before switching to the next banner, trigger the fade out effect
      setFadeIn(false);

      // Switch banners after a short delay for the fade-out effect
      setTimeout(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
        setFadeIn(true); // Fade in new banner
      }, 1000); // Adjust timing to sync with CSS animation duration
    }, 5000); // Change banner every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`banner_section w-full ${className}`}>
      {/* banner container */}
      <div
        className={`banner_container w-full relative ${
          fadeIn ? "fade-in" : "fade-out"
        }`}
      >
        {/* banner item */}
        <div className="banner_item w-full flex flex-row items-center justify-center gap-3">
          <div className="banner_text relative justify-between">
            <div className="top_text flex flex-row items-center justify-start gap-2 slide-in-bottom">
              <FaApple className="fa" />
              <span className="text align-top">
                {banners[currentBanner].title}
              </span>
            </div>
            <div className="bottom_text slide-in-bottom">
              {banners[currentBanner].offer}
            </div>
            <div className="banner_btn">
              <Link
                className=" flex flex-row items-center justify-start hover:gap-4 gap-3 slide-in-bottom"
                href="/"
              >
                <span className="text underline">Shop Now</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
          <div className="banner_image slide-in-right">
            <Image
              src={banners[currentBanner].image}
              alt="banner image"
              width={500}
              height={300}
            />
          </div>
        </div>
      </div>
      {/* Banner count indicators */}
      <div className="banner_count items-center justify-center absolute">
        {banners.map((_, index) => (
          <div
            key={index}
            className={`elipse ${currentBanner === index ? "active" : ""}`}
          ></div>
        ))}
      </div>
    </div>
  );
};
