import './profile.css';

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
          </div>
        </div>
        <div className="profile_container flex w-full h-full relative gap-5">
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
          <div className="profile_con items-start flex flex-col w-4/6 gap-4">
            <h2 className="sec-color">Edit Your Profile</h2>
            <div className="profile_name flex flex-row">
              <div className="first_name w-2/4">
                <h3>First Name</h3>
                <input
                  type="text"
                  name="First Name"
                  id="name"
                  placeholder="First Name"
                  className="w-full"
                />
              </div>
              <div className="last_name w-2/4">
                <h3>Last Name</h3>
                <input
                  type="text"
                  name="Last Name"
                  id="name"
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
            <div className="profile_password flex flex-col">
              <h3>Password Changes</h3>
              <input
                type="password"
                name="Current Password"
                id="Password"
                placeholder="Current Password"
              />
              <input
                type="password"
                name="New Password"
                id="Password"
                placeholder="New Password"
              />
              <input
                type="password"
                name="Confirm New Password"
                id="Password"
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
        </div>
      </div>
    );
}