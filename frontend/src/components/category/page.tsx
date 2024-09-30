"use client";
import React, {useRef} from "react";
import "./category.css";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa6";
import {IoWatchOutline, IoGameControllerOutline} from "react-icons/io5";
import {BiCamera, BiHeadphone} from "react-icons/bi";
import {CiMobile3, CiMonitor} from "react-icons/ci";


export default function Category() {
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({left: -200, behavior: "smooth"});
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({left: 200, behavior: "smooth"});
    }
  };


  return (
    <div className="category_section w-full flex flex-col">
      <div className="category_top flex flex-row items-center gap-2">
        <div className="category_red"></div>
        <h2>Category</h2>
      </div>
      <div className="category_header flex flex-row w-full">
        <div className="header-title">
          <span>Browse By Category</span>
        </div>
        <div className="header_btn flex flex-row">
          <div
            className="icons items-center justify-center"
            onClick={scrollLeft}
          >
            <FaArrowLeft className="icon" />
          </div>
          <div
            className="icons items-center justify-center"
            onClick={scrollRight}
          >
            <FaArrowRight className="icon" />
          </div>
        </div>
      </div>
      <div
        className="category_container flex flex-row overflow-x-auto gap-4"
        ref={scrollContainerRef}
      >
        <div className="category_item">
          <div className="cat_icon">
            <CiMobile3 className="icon" />
          </div>
          <div className="cat_name">Phones</div>
        </div>

        <div className="category_item">
          <div className="cat_icon">
            <CiMonitor className="icon" />
          </div>
          <div className="cat_name">Computer</div>
        </div>

        <div className="category_item">
          <div className="cat_icon">
            <IoWatchOutline className="icon" />
          </div>
          <div className="cat_name">Smart Watch</div>
        </div>

        <div className="category_item">
          <div className="cat_icon">
            <BiCamera className="icon" />
          </div>
          <div className="cat_name">Camera</div>
        </div>

        <div className="category_item">
          <div className="cat_icon">
            <BiHeadphone className="icon" />
          </div>
          <div className="cat_name">Head Phone</div>
        </div>

        <div className="category_item">
          <div className="cat_icon">
            <IoGameControllerOutline className="icon" />
          </div>
          <div className="cat_name">Gaming</div>
        </div>
      </div>
      <hr />
    </div>
  );
}
