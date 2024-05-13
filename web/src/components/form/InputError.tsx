import { cn } from '@/lib/utils'
import React from 'react'
import { MdErrorOutline } from 'react-icons/md'

interface InputErrorProps {
  message: string
  className?: string
}

const InputError = ({ message, className } : InputErrorProps) => {

  const classes = cn("flex text-destructive m-0 p-0", className)

  return (
    <div className={classes}>
      <MdErrorOutline className="w-4 h-4 mr-1 my-auto text-destructive" />
      <p className="text-destructive">{message}</p>
    </div>
  )
}

export default InputError