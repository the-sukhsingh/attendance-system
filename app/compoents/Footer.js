import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 text-white text-center z-10">
      <p>&copy; {
        new Date().getFullYear()
        } Attendance System</p>
    </footer>
  )
}

export default Footer
