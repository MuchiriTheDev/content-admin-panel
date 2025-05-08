import React, { useState, useEffect } from 'react'
import { FaBell } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { MdClose } from 'react-icons/md'

const NotificationCard = ({
  on = true,
  title = 'Notification',
  description = 'Hello world, this is a notification',
  type = 'Info',
  success = true,
}) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(on)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNotificationVisible(false)
    }, 3000) // Close after 3 seconds

    return () => clearTimeout(timer) // Cleanup timer on unmount
  }, [isNotificationVisible])

  if (!isNotificationVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="hidden md:block fixed top-16 right-4 w-72 p-6 bg-white rounded-xl shadow-2xl border border-appleGreen z-20"
    >
      <div className="flex justify-between items-center ">
        <h3 className="text-xl font-extrabold text-brown flex items-center gap-2">
          <FaBell /> {title}
        </h3>
        <MdClose onClick={() => setIsNotificationVisible(false)}/>
      </div>
      <p className="text-brown text-sm mt-2">
        {type} : {success ? 'Success' : 'Error'}
      </p>
      <p className="text-yellowGreen text-sm mt-2 pl-3">{description}</p>
    </motion.div>
  )
}

export default NotificationCard