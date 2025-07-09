import ly1 from "../assets/layer/layer1.webp"
import '../index.css'
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
export default function Layer({ isPlay }) {
    const [isShrunk, setIsShrunk] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShrunk(true);
        }, 5700);
        return () => clearTimeout(timer);

    }, []);



    const baseClasses = "transition-all duration-400 ease-in-out";

    const specificClasses = isShrunk

        ? "w-[60%] h-[60%] object-contain absolute bottom-[1%]"

        : "w-[100%] h-[100%]";

    if (!isPlay) {

        return (

            <div className="w-[100%] animate-fade animate-once animate-duration-1000 animate-delay-[0ms] animate-ease-out">

                <div className="animate-fade animate-once animate-duration-00 animate-delay-[0ms] animate-ease-out">

                    <img src={ly1} alt="One Piece" className="animate-fade animate-once animate-duration-00 animate-delay-[0ms] animate-ease-out" />

                    <br />


                    {/* Maturity Rating */}

                    <div className="flex items-center gap-4 mb-4 animate-fade animate-once animate-duration-00 animate-delay-[0ms] animate-ease-out">

                        <span className="maturity-rating">

                            <span className="maturity-number">K</span>

                        </span>

                        <span className="text-white text-sm opacity-80">2004</span>

                        <span className="text-white text-sm opacity-80">1 giờ 59 phút</span>

                    </div>


                    <p className="netflix-description animate-fade animate-once animate-duration-00 animate-delay-[0ms] animate-ease-out">

                        Sophie vốn dĩ làm việc tại cửa hàng mũ do người cha quá cố để lại. Cuộc sống nơi thị trấn buồn tẻ cứ thế trôi qua trong lặng lẽ... cho đến ngày cô bỗng biến thành bà lão.

                    </p>

                    <div className="flex gap-3 mt-[1.5vw] whitespace-nowrap animate-fade animate-once animate-duration-1000 animate-delay-[0ms] animate-ease-out">

                        {/* Nút Phát */}

                        <button className="netflix-button gap-3 flex items-center justify-center px-8 py-3 !text-lg rounded !bg-white text-black hover:!bg-gray-300 !border-none cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" style={{ fontWeight: '900', textShadow: '0 0 1px rgba(0,0,0,0.5)' }}>

                            <svg

                                xmlns="http://www.w3.org/2000/svg"

                                fill="none"

                                role="img"

                                viewBox="0 0 24 24"

                                width={20}

                                height={20}

                                data-icon="PlayStandard"

                                aria-hidden="true"

                            >

                                <path

                                    d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"

                                    fill="currentColor"

                                />

                            </svg>

                            <span>Phát</span>

                        </button>



                        {/* Nút Thông tin khác */}

                        <button className="netflix-button gap-3 flex items-center justify-center px-[1.6rem] py-[0.8rem] !text-lg rounded !bg-[rgba(109,109,110,0.7)] text-white ml-4 hover:!bg-[rgba(109,109,110,0.4)] !border-none cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" style={{ fontWeight: '900', textShadow: '0 0 1px rgba(255,255,255,0.3)' }}>

                            <svg

                                xmlns="http://www.w3.org/2000/svg"

                                fill="none"

                                role="img"

                                viewBox="0 0 24 24"

                                width={20}

                                height={20}

                                data-icon="CircleIStandard"

                                aria-hidden="true"

                            >

                                <path

                                    fillRule="evenodd"

                                    clipRule="evenodd"

                                    d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"

                                    fill="currentColor"

                                />

                            </svg>

                            <span>Thông tin khác</span>

                        </button>

                    </div>

                </div>

            </div>

        );

    } else {

        return (

            <div className="w-[100%]">

                <div className="">

                    <motion.img src={ly1} alt="One Piece" className="w-full h-full object-contain"

                        variants={{

                            initial: {x:0, y: 0, scale: 1 },

                            shrunk: {x: "-20%", y: "80%", scale: 0.6 }

                        }}



                        animate={isShrunk ? "shrunk" : "initial"}



                        transition={{

                               type: "tween",
    duration: 1.1, 
    ease: "easeInOut",

                        }} />

                    <br />

                    {/* Maturity Rating */}

                    <div className="flex items-center gap-4 mb-4 animate-fade animate-once animate-duration-1000 animate-delay-[5000ms] animate-ease-out animate-reverse">

                        <span className="maturity-rating">

                            <span className="maturity-number">K</span>

                        </span>

                        <span className="text-white text-sm opacity-80">2004</span>

                        <span className="text-white text-sm opacity-80">1 giờ 59 phút</span>

                    </div>


                    <p className="netflix-description animate-fade animate-once animate-duration-1000 animate-delay-[5000ms] animate-ease-out animate-reverse">

                        Sophie vốn dĩ làm việc tại cửa hàng mũ do người cha quá cố để lại. Cuộc sống nơi thị trấn buồn tẻ cứ thế trôi qua trong lặng lẽ... cho đến ngày cô bỗng biến thành bà lão.

                    </p>

                    <div className="flex gap-3 mt-[1.5vw] whitespace-nowrap">

                        {/* Nút Phát */}

                        <button className="netflix-button gap-3 flex items-center justify-center px-8 py-3 !text-lg rounded !bg-white text-black hover:!bg-gray-300 !border-none cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" style={{ fontWeight: '900', textShadow: '0 0 1px rgba(0,0,0,0.5)' }}>

                            <svg

                                xmlns="http://www.w3.org/2000/svg"

                                fill="none"

                                role="img"

                                viewBox="0 0 24 24"

                                width={20}

                                height={20}

                                data-icon="PlayStandard"

                                aria-hidden="true"

                            >

                                <path

                                    d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z"

                                    fill="currentColor"

                                />

                            </svg>

                            <span>Phát</span>

                        </button>



                        {/* Nút Thông tin khác */}

                        <button className="netflix-button gap-3 flex items-center justify-center px-[1.6rem] py-[0.8rem] !text-lg rounded !bg-[rgba(109,109,110,0.7)] text-white ml-4 hover:!bg-[rgba(109,109,110,0.4)] !border-none cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105" style={{ fontWeight: '900', textShadow: '0 0 1px rgba(255,255,255,0.3)' }}>

                            <svg

                                xmlns="http://www.w3.org/2000/svg"

                                fill="none"

                                role="img"

                                viewBox="0 0 24 24"

                                width={20}

                                height={20}

                                data-icon="CircleIStandard"

                                aria-hidden="true"

                            >

                                <path

                                    fillRule="evenodd"

                                    clipRule="evenodd"

                                    d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"

                                    fill="currentColor"

                                />

                            </svg>

                            <span>Thông tin khác</span>

                        </button>

                    </div>

                </div>

            </div>

        );

    }

}