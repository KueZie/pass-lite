import React from 'react'
import { TbError404 } from 'react-icons/tb'

const NotFoundScreen = () => {
  return (
    <div className="flex flex-col align-middle justify-center h-dvh">
      <div className="text-center">
        <TbError404 className="w-24 h-24 mx-auto text-red-500" />
        <p className="text-lg text-primary">Oops! Looks like you're lost.</p>
        <p className="text-primary">Let's get you back <a href="/" className="text-blue-500">home</a>.</p>
      </div>
    </div>
  )
}

export default NotFoundScreen