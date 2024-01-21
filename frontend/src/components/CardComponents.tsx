import { Users } from '@/libs/types'
import React from 'react'

export const CardComponents: React.FC<{card: Users}> = ({card}) => {
  return (
    <div className="bg-white truncate  w-40 md:w-60 shadow-lg rounded-lg p-2 mb-2 hover:bg-gray-100">
      <div className="text-sm text-gray-600">Id: {card.id}</div>
      <div className="text-lg font-semibold text-gray-800 overflow-hidden ">{card.name}</div>
      <div className="text-md text-gray-700 text-ellipsis overflow-hidden">{card.email}</div>
    </div>
  )
}
