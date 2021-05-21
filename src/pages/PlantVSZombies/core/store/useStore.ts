import { useContext } from 'react'
import { RootContext } from './Provider'

export default function useStore() {
    return useContext(RootContext)
}