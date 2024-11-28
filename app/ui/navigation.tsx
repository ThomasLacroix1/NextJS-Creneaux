import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="fixed bg-gray-300 text-black w-full h-14 p-4">
            <ul className="flex flex-row gap-4">
                <li><a href="#home" className="hover:text-gray-400">Home</a></li>
                <li><a href="#services" className="hover:text-gray-400">Services</a></li>
                <li><a href="#about" className="hover:text-gray-400">About</a></li>
                <li><a href="#contact" className="hover:text-gray-400">Contact</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;