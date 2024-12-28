import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

const MainNav = () => {
  return (
    <div className="flex w-full py-4 justify-end pr-4 bg-[#333333]">
        <div className="flex items-center">
            <div className="relative group">
                <button className="text-white cursor-pointer focus:outline-none">
                    <FaUserCircle className="w-8 h-8" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-blue-700 rounded-md shadow-lg z-10 hidden group-focus-within:block">
                <ul>
                    {/* <li className="px-4 py-2 hover:bg-blue-600 cursor-pointer border border-transparent hover:border-blue-500">Settings</li> */}
                    <li className="px-4 py-2 hover:bg-blue-600 cursor-pointer border border-transparent hover:border-blue-500">Log In</li>
                </ul>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MainNav
