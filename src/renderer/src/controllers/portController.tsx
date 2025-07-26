import { create } from "zustand";

type Port = {
    port: String,
    set_port: (port: String) => void
    get_port: () => String
}

export type {Port}

const portController = create<Port>((set, get) => ({
    port: '',
    set_port: (port: String) => {
        set({port: port})
    },
    get_port: () => {
        return get().port
    }
}))

export default portController