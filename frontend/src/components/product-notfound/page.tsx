import './p-notfound.css';

export const ProductNotFound = () => {
    return (
      <div className="pnotfound_section flex items-center justify-center w-full h-full">
        <div className="pnf_container flex flex-col relative w-full h-full items-center justify-center">
          <div className="pnf_text flex flex-col relative w-full h-full items-center justify-center">
            <h1 className="font-bold text-[28px]">
              Oops! A Problem was encountered
            </h1>
            <p className="font-medium text-[16px] opacity-40">
              Not Product Found Or Internet Connection Error
            </p>
          </div>
          <div className="pnf_image"></div>
        </div>
      </div>
    );
}