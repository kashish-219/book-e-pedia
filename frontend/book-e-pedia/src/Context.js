import React, { createContext } from 'react'

export const UserContext = createContext(
  {
    'login' : false,
  }
);

export const CartContext = createContext();

function Context() {
  return (
    <div>
      
    </div>
  )
}

export default Context
