import './not-found.css';
import Link from 'next/link';

export default function NotFoundPage() {
    return (
      <div className="notfound_section flex flex-col items-start justify-center">
        <div className="notfound_top">
          <div className="profile_nav flex flex-row gap-1 items-start justify-start">
            <span className="faint">Home</span>
            <span className="faint">/</span>
            <span className="full">404{''} Error</span>
          </div>
        </div>
        <div className="notfound_container flex flex-col items-center justify-center relative gap-16">
          <h1 className="notfound_head">
            404 Not Found
          </h1>
          <span className="notfound_desc">
            Your visited page was not found. You may go back to homepage.
          </span>
          <Link href='/'>
            <span className="notfound_btn">
              Back to Homepage
            </span>
          </Link>
        </div>
      </div>
    );
}