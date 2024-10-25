import React, { useState } from 'react';
import {
  FaCompass,
  FaRegCompass,
  // FaShoppingBag,
  // FaComments,
  // FaSearch,
  // FaBell,
  // FaChevronDown,
} from "react-icons/fa";
import {
  RiHome4Fill,
  RiHome4Line,
  RiQuestionnaireLine,
  RiQuestionnaireFill,
} from "react-icons/ri";
import {
  IoBarChartOutline,
  IoBarChart,
  IoBagOutline,
  IoSettingsOutline,
  IoBag,
  IoSettings,
} from "react-icons/io5";
import {HiMiniUsers, HiOutlineUsers} from "react-icons/hi2";
import {PiChatsTeardropFill, PiChatsTeardropThin} from "react-icons/pi";
import {TbLogout2} from "react-icons/tb";
import {LuChevronLeft, LuChevronRight} from "react-icons/lu";

interface SidebarItemProps {
  icon: React.ReactNode; // Define the type for the icon
  text: string; // Define the type for the text
  active?: boolean; // Optional prop
  onClick?: () => void;
  isExpanded: boolean;
}

interface AnalyticCardProps {
  title: string; // Define the type for the title
  value: number | string; // Define the type for the value (can be number or string)
  change: number | string; // Define the type for the change (can be number or string)
  negative?: boolean; // Optional prop
}

const mockData = {
  totalCustomers: "307.48K",
  totalRevenue: "$30.58K",
  totalDeals: "2.48K",
  topCountries: [
    {name: "Australia", sales: "7.12K", trend: "up"},
    {name: "Belgium", sales: "4.15K", trend: "down"},
    {name: "Canada", sales: "6.45K", trend: "up"},
    {name: "Costa Rica", sales: "3.85K", trend: "down"},
    {name: "Austria", sales: "6.98K", trend: "up"},
  ],
  topCustomers: [
    {name: "Robert Lewis", purchases: 20, amount: "$4.19K"},
    {name: "Tom Barrett", purchases: 21, amount: "$3.56K"},
    {name: "Jenson Doyle", purchases: 17, amount: "$3.12K"},
    {name: "Donald Cortez", purchases: 15, amount: "$2.14K"},
  ],
  topProducts: [
    {
      name: "Denim Jacket",
      category: "Men's Tops",
      stock: "In Stock",
      sales: "1.43k",
    },
    {
      name: "Nike Air Max 97",
      category: "Men's Shoes",
      stock: "Out of Stock",
      sales: "2.68k",
    },
    {
      name: "Jordan Air",
      category: "Men's T-Shirt",
      stock: "In Stock",
      sales: "1.43k",
    },
  ],
  recentOrders: [
    {product: "Nike Air Force 1", category: "Shoes", price: "$110.96"},
    {product: "Men's Dri-FIT 7", category: "Sports", price: "$38.97"},
    {product: "Jordan Dri-FIT Sport", category: "Sports", price: "$35.50"},
  ],
};

const AnalyticCard: React.FC<AnalyticCardProps> = ({
  title,
  value,
  change,
  negative = false,
}) => (
  <div className="bg-transparent p-6 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    <p className={`mt-2 ${negative ? "text-red-600" : "text-green-600"}`}>
      {change} <span className="text-gray-500">This month</span>
    </p>
  </div>
);

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  active = false,
  onClick,
  isExpanded,
}) => (
  <div
    className={`flex flex-row items-center justify-start mb-4 hover:bg-[--elipse] cursor-pointer p-2 rounded-[10px] ${
      active ? "bg-[--black]" : ""
    } ${isExpanded ? "w-full" : "w-fit items-center justify-center"} group`}
    onClick={onClick}
  >
    <div
      className={`flex text-[20px] items-center justify-center h-full  ${
        active ? "text-[--text]" : "text-[--text2]"
      } ${isExpanded ? "ml-2" : ""} group-hover:text-[--text1] `}
    >
      {icon}
    </div>
    {isExpanded && (
      <span
        className={`ml-2 pr-1 text-[18px] h-full font-normal ${
          active ? "text-[--text]" : "text-[--text2]"
        } group-hover:text-[--text1]`}
      >
        {text}
      </span>
    )}
  </div>
);

export const Analytic = () => {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Analytics Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="analytic_card bg-blue-100 rounded-lg shadow">
            <AnalyticCard
              title="Total Customer"
              value={mockData.totalCustomers}
              change="+30%"
            />
          </div>
          <div className="analytic_card bg-green-100 rounded-lg shadow">
            <AnalyticCard
              title="Total Revenue"
              value={mockData.totalRevenue}
              change="-15%"
              negative
            />
          </div>
          <div className="analytic_card bg-blue-100 rounded-lg shadow">
            <AnalyticCard
              title="Total Deals"
              value={mockData.totalDeals}
              change="+23%"
            />
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Earnings</h2>
          {/* Replace with actual chart component */}
          <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
            Chart Placeholder
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Top selling products</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S/NO: 01
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total sales
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.topProducts.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock === "In Stock"
                          ? " text-green-500"
                          : " text-red-500"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.sales}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}

export const DashContent = () => {
    return (
      <div className="flex flex-col w-full gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Countries by Sells</h2>
          <ul>
            {mockData.topCountries.map((country, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{country.name}</span>
                <span
                  className={`font-semibold ${
                    country.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {country.sales}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Customers</h2>
          <ul>
            {mockData.topCustomers.map((customer, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full mr-3"></div>
                  <span>{customer.name}</span>
                </div>
                <span className="font-semibold">{customer.amount}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Customers</h2>
          <ul>
            {mockData.recentOrders.map((customer, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full mr-3"></div>
                  <div className="flex flex-col">
                    <span>{customer.product}</span>
                    <span>{customer.category}</span>
                  </div>
                </div>
                <span className="font-semibold">{customer.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}

export const SideBar = () => {
    const [activeIndex, setActiveIndex] = useState<number>(1); // State to track active item
    const [isExpanded, setIsExpanded] = useState(true);

  const handleItemClick = (index: number) => {
    setActiveIndex(index); // Update active index on click
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  
    return (
      <div
        className={`dashboard_sidebar z-50 relative h-screen border-r-2 border-dashed  transition-all duration-300 bg-[rgba(0,0,0,0.2)] rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 border border-[rgba(255,255,255,0.2)] shadow-lg ${
          isExpanded ? "w-full" : "w-18"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 top-8 bg-[--primary] rounded-full p-2 text-[--text2] z-10 border-2 border-dashed border-[--text1]"
        >
          {isExpanded ? (
            <LuChevronLeft size={20} />
          ) : (
            <LuChevronRight size={20} />
          )}
        </button>
        <div className="w-full h-full flex flex-col items-start justify-between bg-transparent text-white p-6">
          <div className="flex flex-col gap-5">
            <nav>
              {[
                {
                  icon: activeIndex === 0 ? <RiHome4Fill /> : <RiHome4Line />,
                  text: "Home",
                },
                {
                  icon:
                    activeIndex === 1 ? <IoBarChart /> : <IoBarChartOutline />,
                  text: "Analytics",
                },
                {
                  icon: activeIndex === 2 ? <FaCompass /> : <FaRegCompass />,
                  text: "Explore",
                },
                {
                  icon: activeIndex === 3 ? <IoBag /> : <IoBagOutline />,
                  text: "Shop",
                },
                {
                  icon:
                    activeIndex === 4 ? (
                      <PiChatsTeardropFill />
                    ) : (
                      <PiChatsTeardropThin />
                    ),
                  text: "Chat",
                },
              ].map((item, index) => (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  active={activeIndex === index} // Check if this item is active
                  onClick={() => handleItemClick(index)} // Pass click handler
                  isExpanded={isExpanded}
                />
              ))}
            </nav>
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-[--text2] mb-4">
                Tools
              </h3>
              {[
                {
                  icon:
                    activeIndex === 5 ? <IoSettings /> : <IoSettingsOutline />,
                  text: "Settings",
                },
                {
                  icon:
                    activeIndex === 6 ? (
                      <RiQuestionnaireFill />
                    ) : (
                      <RiQuestionnaireLine />
                    ),
                  text: "Help",
                },
                {
                  icon:
                    activeIndex === 7 ? <HiMiniUsers /> : <HiOutlineUsers />,
                  text: "Manage user",
                },
              ].map((item, index) => (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  active={activeIndex === index + 5} // Adjust index for tools
                  onClick={() => handleItemClick(index + 5)} // Adjust index for tools
                  isExpanded={isExpanded}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <SidebarItem
              icon={<TbLogout2 />}
              text="Log Out"
              isExpanded={isExpanded}
            />
          </div>
        </div>
      </div>
    );
}