"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react"

export type CartItem = {
  id:       string
  name:     string
  tagline:  string
  price:    number
  pack:     string
  qty:      number
}

type State = { items: CartItem[]; open: boolean }

type Action =
  | { type: "ADD";    item: Omit<CartItem, "qty"> }
  | { type: "REMOVE"; id: string; pack: string }
  | { type: "SET_QTY"; id: string; pack: string; qty: number }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "HYDRATE"; items: CartItem[] }

function key(id: string, pack: string) { return `${id}__${pack}` }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items }

    case "ADD": {
      const k = key(action.item.id, action.item.pack)
      const exists = state.items.find(i => key(i.id, i.pack) === k)
      const items = exists
        ? state.items.map(i => key(i.id, i.pack) === k ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...action.item, qty: 1 }]
      return { ...state, items, open: true }
    }

    case "REMOVE":
      return { ...state, items: state.items.filter(i => key(i.id, i.pack) !== key(action.id, action.pack)) }

    case "SET_QTY": {
      if (action.qty < 1)
        return { ...state, items: state.items.filter(i => key(i.id, i.pack) !== key(action.id, action.pack)) }
      return {
        ...state,
        items: state.items.map(i => key(i.id, i.pack) === key(action.id, action.pack) ? { ...i, qty: action.qty } : i),
      }
    }

    case "TOGGLE_CART": return { ...state, open: !state.open }
    case "OPEN_CART":   return { ...state, open: true }
    case "CLOSE_CART":  return { ...state, open: false }

    default: return state
  }
}

const CartCtx = createContext<{
  state:    State
  dispatch: React.Dispatch<Action>
  total:    number
  count:    number
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], open: false })

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wff-cart")
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) })
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("wff-cart", JSON.stringify(state.items))
  }, [state.items])

  const total = state.items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = state.items.reduce((s, i) => s + i.qty, 0)

  return <CartCtx.Provider value={{ state, dispatch, total, count }}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error("useCart must be inside CartProvider")
  return ctx
}
