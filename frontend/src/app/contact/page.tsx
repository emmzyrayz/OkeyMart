import './contact.css';
import { FiPhone, FiMail } from 'react-icons/fi';

export default function Contact() {
    return (
      <div className="contact_section flex flex-col items-start justify-center">
        <div className="contact_top">
          <div className="profile_nav flex flex-row gap-1 items-start justify-start">
            <span className="faint">Home</span>
            <span className="faint">/</span>
            <span className="full">Contact</span>
          </div>
        </div>

        <div className="contact_container flex flex-row w-full h-full items-center justify-center gap-5">
          <div className="contact_con flex flex-col h-full justify-center gap-11">
            <div className="call_con flex flex-col gap-2">
              <div className="call_head flex flex-row items-center justify-start gap-2">
                <div className="contact_icons">
                  <FiPhone className="call_icon" />
                </div>
                <h2>Call To Us</h2>
              </div>
              <div className="call_body">
                <p>We are available 24/7 days a week.</p>
                <p>Phone: +8801611112222</p>
              </div>
            </div>
            <hr />
            <div className="write_con flex flex-col gap-2">
              <div className="write_head flex flex-row items-center justify-start gap-2">
                <div className="contact_icons">
                  <FiMail className="write_icon" />
                </div>
                <h2>Write To Us</h2>
              </div>
              <div className="write_body">
                <span>
                  Fill out our form and we will contact you within 24 hours.
                </span>
                <span>Email: customer@exclusive.com</span>
                <span>Email: support@exclusive.com</span>
              </div>
            </div>
          </div>
          <div className="contact_form flex flex-col h-full justify-center items-end gap-3">
            <div className="form_top flex flex-row items-center justify-around h-1/4 w-full">
              <input type="name" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <input type="tel" placeholder="Your Phone" required />
            </div>
            <div className="form_bottom flex items-start h-2/4 justify-start relative">
              <textarea name="Message" id="message_input" placeholder='Your Message'></textarea>
            </div>
            <div className="form_btn flex items-center h-1/4 justify-center">
              <span>Send Message</span>
            </div>
          </div>
        </div>
      </div>
    );
}