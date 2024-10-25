'use client'
import { useState } from 'react';
import './profile.css';
import { FaAddressCard, FaRegAddressCard, FaRegUserCircle, FaUserCircle } from 'react-icons/fa';
import { MdPayments, MdCancel, MdOutlineCancel } from 'react-icons/md';
import { TbTruckReturn } from 'react-icons/tb';
import Link from 'next/link';

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  // Helper function to determine if a section should be visible
  const isSectionVisible = (sectionName: string) => activeSection === sectionName;


    return (
      <div className="profile_section w-full h-full">
        <div className="profile_top flex flex-row items-center justify-between w-full my-10">
          <div className="profile_nav flex flex-row gap-1 items-center justify-center">
            <span className="faint">
              <Link href='/'>Home</Link>
            </span>
            <span className="faint">/</span>
            <span className="full">Settings</span>
          </div>

          <div className="profile_welcome flex flex-row gap-2 items-center justify-center">
            Welcome!
            <span>Md Rimel</span>
            <div className="user_icon flex items-center justify-center">
              <FaUserCircle className="fa online" />
            </div>
          </div>
        </div>
        <div className="profile_container flex w-full h-full gap-5">
          <div className="profile_menu flex flex-col w-2/6 relative">
            <div className="my-account flex flex-col gap-2">
              <h2>Manage My Account</h2>
              <div className="account_list flex flex-col">
                <span
                  className={`cursor-pointer ${
                    activeSection === "profile"
                      ? "text-white bg-black"
                      : "text-black"
                  }`}
                  onClick={() => setActiveSection("profile")}
                >
                  {activeSection === "profile" ? (
                    <FaRegUserCircle className="iccons" />
                  ) : (
                    <FaUserCircle className="iccons" />
                  )}
                  My Profile
                </span>
                <span
                  className={`cursor-pointer ${
                    activeSection === "address"
                      ? "text-white bg-black"
                      : "text-black"
                  }`}
                  onClick={() => setActiveSection("address")}
                >
                  {activeSection === "profile" ? (
                    <FaRegAddressCard className="iccons" />
                  ) : (
                    <FaAddressCard className="iccons" />
                  )}
                  Address Book
                </span>
                <span
                  className={`cursor-pointer ${
                    activeSection === "payment"
                      ? "text-white bg-black"
                      : "text-black"
                  }`}
                  onClick={() => setActiveSection("payment")}
                >
                  {activeSection === "profile" ? (
                    <MdPayments className="iccons" />
                  ) : (
                    <MdPayments className="iccons" />
                  )}
                  My Payment Options
                </span>
              </div>
            </div>
            <div className="orders flex flex-col gap-2">
              <h2>My orders</h2>
              <div className="order_list flex flex-col">
                <span
                  className={`cursor-pointer ${
                    activeSection === "returns"
                      ? "text-white bg-black"
                      : "text-black"
                  }`}
                  onClick={() => setActiveSection("returns")}
                >
                  {activeSection === "profile" ? (
                    <TbTruckReturn className="iccons" />
                  ) : (
                    <TbTruckReturn className="iccons" />
                  )}
                  My Returns
                </span>
                <span
                  className={`cursor-pointer ${
                    activeSection === "cancellations"
                      ? "text-white bg-black"
                      : "text-black"
                  }`}
                  onClick={() => setActiveSection("cancellations")}
                >
                  {activeSection === "profile" ? (
                    <MdOutlineCancel className="iccons" />
                  ) : (
                    <MdCancel className="iccons" />
                  )}
                  My Cancellations
                </span>
              </div>
            </div>
            {/* <div className="wishlist flex flex-col gap-2">
              <h2>My Wishlist</h2>
            </div> */}
          </div>
          <div className="profile_con_sec flex flex-col items-center justify-center w-4/6 relative h-auto">
            <div
              className={`profile_con items-start absolute top-0 w-full ${
                isSectionVisible("profile") ? "flex" : "hidden"
              } flex-col gap-4`}
            >
              <h2 className="sec-color">Edit Your Profile</h2>
              <div className="profile_name flex flex-row">
                <div className="first_name w-2/4">
                  <h3>First Name</h3>
                  <input
                    type="text"
                    name="First Name"
                    id="firstname"
                    placeholder="First Name"
                    className="w-full"
                  />
                </div>
                <div className="last_name w-2/4">
                  <h3>Last Name</h3>
                  <input
                    type="text"
                    name="Last Name"
                    id="lastname"
                    placeholder="Last Name"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="profile_detail flex flex-row">
                <div className="profile_email w-2/4">
                  <h3>Email</h3>
                  <input
                    type="email"
                    name="Email"
                    id="email"
                    placeholder="Email"
                  />
                </div>
                <div className="profile_address w-2/4">
                  <h3>Address</h3>
                  <input
                    type="text"
                    name="Address"
                    id="address"
                    placeholder="Address"
                  />
                </div>
              </div>
              <div className="profile_detail flex flex-row">
                <div className="profile_email w-2/4">
                  <h3>Phone</h3>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="profile_address w-2/4">
                  <h3>Date of Birth</h3>
                  <input
                    type="date"
                    name="date of birth"
                    id="dateofbirth"
                    placeholder="Date of Birth"
                  />
                </div>
              </div>
              <div className="profile_password flex flex-col">
                <h3>Password Changes</h3>
                <input
                  type="password"
                  name="Current Password"
                  id="currentPassword"
                  placeholder="Current Password"
                />
                <input
                  type="password"
                  name="New Password"
                  id="newPassword"
                  placeholder="New Password"
                />
                <input
                  type="password"
                  name="Confirm New Password"
                  id="confirmPassword"
                  placeholder="Confirm New Password"
                />
              </div>
              <div className="profile_btn flex flex-row">
                <div className="cancel_btn">
                  <span>Cancel</span>
                </div>
                <div className="save_btn">
                  <span>Save Changes</span>
                </div>
              </div>
            </div>
            <div
              className={`address_con items-start conn_ absolute top-0 w-full ${
                isSectionVisible("address") ? "flex" : "hidden"
              } flex-col gap-4`}
            >
              <h2 className="sec-color">Edit Your Address Book</h2>
              <div className="profile_name flex flex-row">
                <div className="first_name w-2/4">
                  <h3>Street No.</h3>
                  <input
                    type="text"
                    name="Street No."
                    id="street"
                    placeholder="Street No."
                    className="w-full"
                  />
                </div>
                <div className="last_name w-2/4">
                  <h3>Street Name</h3>
                  <input
                    type="text"
                    name="street Name"
                    id="streetname"
                    placeholder="Street Name"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="profile_detail flex flex-row">
                <div className="profile_email w-2/4">
                  <h3>Local Gov. Area</h3>
                  <input type="text" name="LGA" id="lga" placeholder="LGA" />
                </div>
                <div className="profile_address w-2/4">
                  <h3>State of Residence</h3>
                  <input
                    type="text"
                    name="SOR"
                    id="SOR"
                    placeholder="Residence"
                  />
                </div>
              </div>
              <div className="profile_detail flex flex-row">
                <div className="profile_email w-2/4">
                  <h3>LGA. of Origin</h3>
                  <input
                    type="text"
                    name="LGAO"
                    id="lgao"
                    placeholder="LGA. of Origin"
                  />
                </div>
                <div className="profile_address w-2/4">
                  <h3>State Of Origin</h3>
                  <input
                    type="text"
                    name="State of Origin"
                    id="SOO"
                    placeholder="State of Origin"
                  />
                </div>
              </div>
              <div className="profile_password flex flex-col">
                <h3>Residence Landmark</h3>
                <input
                  type="text"
                  name="Residence Landmark"
                  id="RL"
                  placeholder="Residence Landmark"
                />
              </div>
              <div className="profile_btn flex flex-row">
                <div className="cancel_btn">
                  <span>Cancel</span>
                </div>
                <div className="save_btn">
                  <span>Save Changes</span>
                </div>
              </div>
            </div>
            <div
              className={`paymentTop_con conn_ items-start absolute top-0 w-full ${
                isSectionVisible("payment") ? "flex" : "hidden"
              } flex-col gap-4`}
            >
              <h2 className="sec-color">Edit Your Payment Option</h2>
              <div className="profile_name flex flex-row">
                <div className="first_name w-2/4">
                  <h3>Bank Name</h3>
                  <input
                    type="text"
                    name="bank name"
                    id="bankName"
                    placeholder="Bank Name"
                    className="w-full"
                  />
                </div>
                <div className="last_name w-2/4">
                  <h3>Bank Code</h3>
                  <input
                    type="text"
                    name="Bank Code"
                    id="bankCode"
                    placeholder="Bank Code"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="profile_detail flex flex-row">
                <div className="profile_email w-2/4">
                  <h3>Account Name</h3>
                  <input
                    type="text"
                    name="account name"
                    id="accountName"
                    placeholder="Account Name"
                  />
                </div>
                <div className="profile_address w-2/4">
                  <h3>Account Number</h3>
                  <input
                    type="number"
                    name="account number"
                    id="accountNumber"
                    placeholder="Account Number"
                  />
                </div>
              </div>
              <div className="profile_detail flex flex-row">
                <div className="profile_email w-2/4">
                  <h3 className="flex flex-col items-start relative gap-1 justify-end">
                    Digital Bank Name{" "}
                    <span className="font-[400] text-[10px] text-clip opacity-40 absolute bottom-0 right-1">
                      (Palmpay/Opay)
                    </span>
                  </h3>
                  <input
                    type="text"
                    name="Digital Bank Name"
                    id="DBNA"
                    placeholder="Digital Bank Name"
                  />
                </div>
                <div className="profile_address w-2/4">
                  <h3>Digital Bank Number</h3>
                  <input
                    type="text"
                    name="dbn"
                    id="DBNU"
                    placeholder="Digital Bank Number"
                  />
                </div>
              </div>
              <div className="profile_password flex flex-col">
                <h3 className="flex flex-col items-start relative gap-1 justify-end">
                  BTC wallet address{" "}
                  <span className="font-[400] text-[10px] text-clip opacity-40 absolute bottom-0 right-1">
                    (Trust-wallet/Binance)
                  </span>
                </h3>
                <input
                  type="text"
                  name="btc wallet address"
                  id="btcwa"
                  placeholder="BTC wallet address"
                />
              </div>
              <div className="profile_btn flex flex-row">
                <div className="cancel_btn">
                  <span>Cancel</span>
                </div>
                <div className="save_btn">
                  <span>Save Changes</span>
                </div>
              </div>
            </div>
            <div
              className={`return_con conn_ items-start absolute top-0 w-full ${
                isSectionVisible("returns") ? "flex" : "hidden"
              } flex-col gap-4`}
            >
              <h2 className="sec-color text-xl">My Returns</h2>
              <div className="bg-white w-full rounded-lg shadow p-4">
                {/* Returns Table */}
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">Order ID</th>
                      <th className="py-2 text-left">Product</th>
                      <th className="py-2 text-left">Return Date</th>
                      <th className="py-2 text-left">Status</th>
                      <th className="py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">#12345</td>
                      <td className="py-3">Product Name</td>
                      <td className="py-3">2024-10-20</td>
                      <td className="py-3">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                          Pending
                        </span>
                      </td>
                      <td className="py-3">
                        <button className="text-blue-600 hover:underline">
                          View Details
                        </button>
                      </td>
                    </tr>
                    {/* Add more rows as needed */}
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className={`cancellation_con conn_ items-start absolute top-0 w-full ${
                isSectionVisible("cancellations") ? "flex" : "hidden"
              } flex-col gap-4`}
            >
              <h2 className="sec-color text-xl">My Cancellations</h2>
              <div className="bg-white rounded-lg shadow p-4">
                {/* Cancellations Table */}
                <table className="w-full">
                  <thead>
                    <tr className="border-b w-full">
                      <th className="py-2 text-left">Order ID</th>
                      <th className="py-2 text-left">Product</th>
                      <th className="py-2 text-left">Cancel Date</th>
                      <th className="py-2 text-left">Reason</th>
                      <th className="py-2 text-left">Refund Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b w-full">
                      <td className="p-2 text-[14px] font-medium">#12346</td>
                      <td className="p-2 text-[14px] font-medium">
                        Product Name
                      </td>
                      <td className="p-2 text-[14px] font-medium">
                        2024-10-19
                      </td>
                      <td className="p-2 text-[14px] font-medium">
                        Changed mind
                      </td>
                      <td className="p-2 text-[14px] font-medium">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                          Processed
                        </span>
                      </td>
                    </tr>
                    {/* Add more rows as needed */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}