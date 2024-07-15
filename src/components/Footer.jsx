import React from 'react';

const Footer = () => {
    return (
        <div className="bg-[#1d2835] text-[#C5C6C7] py-2 px-4 w-full bottom-0">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="text-lg m-4">
                    &copy; 2024 @aashutosh148
                </div>
                <div className="text-lg text-bold m-4">
                Made with <span aria-label="Love" style={{ color: '#f43f5e' }}>&hearts;</span> in India
                </div>
            </div>
        </div>
    );
};

export default Footer;
