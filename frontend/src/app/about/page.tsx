'use client'
import './about.css';
import Image from 'next/image';
import AboutB from '../../assets/img/avatar/about_banner.png';
import Action from '@/components/action/page';
import {FiShoppingBag} from "react-icons/fi";
import {TbCalendarDollar} from "react-icons/tb";
import { BiStoreAlt } from 'react-icons/bi';
import { CiDollar } from 'react-icons/ci';
import { FaXTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import WillSmith from '../../assets/img/avatar/willsmith.png';
import EmmaWatson from '../../assets/img/avatar/emmawatson.png';
import TomCruise from '../../assets/img/avatar/tomcruise.png';
import Link from 'next/link';

export default function About() {
    return (
      <div className="about_section">
        <div className="about_top">
          <div className="profile_nav flex flex-row gap-1 items-start justify-start">
            <span className="faint">Home</span>
            <span className="faint">/</span>
            <span className="full">My Account</span>
          </div>
        </div>

        <div className="about_container flex flex-row items-center w-full h-full gap-4">
          <div className="about_text w-1/2 flex flex-col items-start gap-2">
            <h1>Our Story</h1>
            <span className="story gap-2">
              <p>
                Launced in 2015, Exclusive is South Asia&apos;s premier online
                shopping makterplace with an active presense in Bangladesh.
                Supported by wide range of tailored marketing, data and service
                solutions, Exclusive has 10,500 sallers and 300 brands and
                serves 3 millioons customers across the region.{" "}
              </p>
              <p>
                Exclusive has more than 1 Million products to offer, growing at
                a very fast. Exclusive offers a diverse assotment in categories
                ranging from consumer.
              </p>
            </span>
          </div>
          <div className="about_img w-1/2 flex flex-col items-center justify-center">
            <Image src={AboutB} alt="" width={500} height={300} />
          </div>
        </div>

        <div className="about_stats flex flex-row items-center justify-center gap-2 w-full">
          <div className="about_stat">
            <div className="stat_img">
              <BiStoreAlt className="stat_icon" />
            </div>
            <h1>10.5k</h1>
            <div className="stat_desc">Sellers active on our site</div>
          </div>
          <div className="about_stat">
            <div className="stat_img">
              <CiDollar className="stat_icon" />
            </div>
            <h1>33k</h1>
            <div className="stat_desc">Monthly Product Sales</div>
          </div>
          <div className="about_stat">
            <div className="stat_img">
              <FiShoppingBag className="stat_icon" />
            </div>
            <h1>45.5k</h1>
            <div className="stat_desc">Customers active on our site</div>
          </div>
          <div className="about_stat">
            <div className="stat_img">
              <TbCalendarDollar className="stat_icon" />
            </div>
            <h1>25k</h1>
            <div className="stat_desc">Annual Gross sales on our site</div>
          </div>
        </div>

        <div className="about_devs_con flex flex-col gap-3">
          <div className="about_devs flex flex-row w-full overflow-auto gap-4">
            <div className="about_dev flex flex-col">
              <div className="dev_image">
                <Image
                  src={TomCruise}
                  alt=""
                  width={300}
                  height={500}
                  className="dev_img"
                />
              </div>
              <div className="dev_desc">
                <h2>Tom Cruise</h2>
                <span className="dev_title">Founder & Chairman</span>
                <div className="dev_links">
                  <Link href="https://www.x.com/tom_cruise-1b1b1">
                    <FaXTwitter className="dev_social" />
                  </Link>

                  <Link href="https://www.instagram.com/tom_cruise-1b1b1">
                    <FaInstagram className="dev_social" />
                  </Link>

                  <Link href="https://www.linkedin.com/tom_cruise-1b1b1">
                    <FaLinkedinIn className="dev_social" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="about_dev flex flex-col">
              <div className="dev_image">
                <Image
                  src={EmmaWatson}
                  alt=""
                  width={300}
                  height={500}
                  className="dev_img"
                />
              </div>
              <div className="dev_desc">
                <h2>Emma Watson</h2>
                <span className="dev_title">Managing Director</span>
                <div className="dev_links">
                  <Link href="https://www.x.com/Emma_Watson-1b1b1">
                    <FaXTwitter className="dev_social" />
                  </Link>

                  <Link href="https://www.instagram.com/Emma_Watson-1b1b1">
                    <FaInstagram className="dev_social" />
                  </Link>

                  <Link href="https://www.linkedin.com/Emma_Watson-1b1b1">
                    <FaLinkedinIn className="dev_social" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="about_dev flex flex-col">
              <div className="dev_image">
                <Image
                  src={WillSmith}
                  alt=""
                  width={300}
                  height={500}
                  className="dev_img"
                />
              </div>
              <div className="dev_desc">
                <h2>Will Smith</h2>
                <span className="dev_title">Product Designer</span>
                <div className="dev_links">
                  <Link href="https://www.x.com/Will_Smith-1b1b1">
                    <FaXTwitter className="dev_social" />
                  </Link>

                  <Link href="https://www.instagram.com/Will_Smith-1b1b1">
                    <FaInstagram className="dev_social" />
                  </Link>

                  <Link href="https://www.linkedin.com/Will_Smith-1b1b1">
                    <FaLinkedinIn className="dev_social" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="devs_slide flex flex-row items-center justify-center w-full gap-3">
            <span className="slide_btn"></span>
            <span className="slide_btn"></span>
            <span className="slide_btn active"></span>
            <span className="slide_btn"></span>
            <span className="slide_btn"></span>
          </div>
        </div>

        <Action />
      </div>
    );
}