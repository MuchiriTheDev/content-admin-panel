import React from 'react'
import { motion } from 'framer-motion'

const Title = ({head, subHead}) => {
  return (
    <div className='w-full py-10 h-fit'>

        {/* head */}
        <motion.h1
          initial={{y:50, opacity:0}}
          whileInView={{y:0, opacity: 1}}
          transition={{duration:0.7 , delay: 0.3}}
          viewport={{ once: true }}
          className='md:text-4xl text-2xl text-brown font-bold mb-3 text-center w-full'>
            {head}
        </motion.h1>

        {/* subHead */}
        <motion.p
          initial={{y:50, opacity:0}}
          whileInView={{y:0, opacity: 1}}
          transition={{duration:0.7 , delay: 0.5}}
          viewport={{ once: true }} 
          className='md:text-lg text-base text-brown font-medium opacity-70 mb-3 text-center w-full'>
            {subHead}
        </motion.p>

    </div>
  )
}

export default Title