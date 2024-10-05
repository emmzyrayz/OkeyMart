import './profile.css';
import { FaUserCircle } from 'react-icons/fa';

export default function Profile() {
    return (
      <div className="profile_section w-full h-full">
        <div className="profile_top flex flex-row items-center justify-between w-full my-10">
          <div className="profile_nav flex flex-row gap-1 items-center justify-center">
            <span className="faint">Home</span>
            <span className="faint">/</span>
            <span className="full">My Account</span>
          </div>

          <div className="profile_welcome flex flex-row gap-2 items-center justify-center">
            Welcome!
            <span>Md Rimel</span>
            <div className="user_icon flex items-center justify-center">
              <FaUserCircle className='fa online' />
            </div>
          </div>
        </div>
        <div className="profile_container flex w-full h-full gap-5">
          <div className="profile_menu flex flex-col w-2/6 relative">
            <div className="my-account flex flex-col gap-2">
              <h2>Manage My Account</h2>
              <div className="account_list flex flex-col">
                <span className="sec-color">My Profile</span>
                <span className="">Address Book</span>
                <span className="">My Payment Options</span>
              </div>
            </div>
            <div className="orders flex flex-col gap-2">
              <h2>My orders</h2>
              <div className="order_list flex flex-col">
                <span className="">My Returns</span>
                <span className="">My Cancellations</span>
              </div>
            </div>
            <div className="wishlist flex flex-col gap-2">
              <h2>My Wishlist</h2>
            </div>
          </div>
          <div className="profile_con_sec flex flex-col items-center justify-center w-4/6 relative h-auto">
            <div className="profile_con items-start flex flex-col w-full gap-4 absolute top-0 hidden">
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
            <div className="address_con hidden conn_ items-start flex flex-col w-full gap-4 absolute top-0">
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
            <div className="paymentop_con conn_ items-start flex flex-col w-full gap-4 absolute top-0">
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
            <div className="return_con items-start flex flex-col w-full gap-4 absolute top-0"></div>
            <div className="cancellation_con items-start flex flex-col w-full gap-4 absolute top-0"></div>
          </div>
        </div>
      </div>
    );
}