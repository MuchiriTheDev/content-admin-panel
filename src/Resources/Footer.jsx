import React from 'react';
import { assets } from '../assets/assets.js';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <div
            id="footer"
            className="text-center border-t-2 border-gray-500 mx-5 flex items-center justify-center flex-col p-2 py-7"
        >
            <a
                href="/"
                className="flex items-center gap-2 justify-center mb-5 text-2xl font-bold text-brown"
            >
                <img src={assets.logo2} className="h-fit w-40" alt="" />
            </a>

            <span className="block text-sm text-center text-gray-500">
                © 2025 Content Creator Insurance™. All Rights Reserved. Built By{' '}
                <a
                    href="https://muchiri-the-dev.vercel.app/"
                    className="text-appleGreen font-semibold hover:underline"
                >
                    Muchiri Mwangi
                </a>
                .
            </span>

            <ul className="flex justify-center mt-5 space-x-5">
                <li>
                    <a href="#" className="text-gray-500 hover:text-appleGreen">
                        <FaFacebookF className="w-12 h-12" />
                    </a>
                </li>
                <li>
                    <a href="#" className="text-gray-500 hover:text-appleGreen">
                        <FaInstagram className="w-12 h-12" />
                    </a>
                </li>
                <li>
                    <a href="#" className="text-gray-500 hover:text-appleGreen">
                        <FaTwitter className="w-12 h-12" />
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Footer;