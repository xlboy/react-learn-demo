import React, { createContext } from 'react'
import store from './store'

export const RootContext = createContext<typeof store>(store)

const Provider: React.FC = ({ children }) => {
  return <RootContext.Provider value={store}>{children}</RootContext.Provider>
}
export default Provider
