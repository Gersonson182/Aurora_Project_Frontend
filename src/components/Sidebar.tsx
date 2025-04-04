import { useState } from "react"
import {NavLink} from "react-router-dom"

export const Sidebar = () => {

 const [isInsumosOpen, setIsInsumosOpen] = useState(false);

    return(
        <aside className="w-64 bg-gray-800 text-white h-screen p-4">
            <h2 className="text-2xl font-bold mb-6">Doña Aurora  Dashboard</h2>
            <nav className="space-y-0.5">

                <div>
                <button className="w-full text-left px-4 py-2 flex items-center justify-between rounded bg-gray-700 hover:bg-gray-600 transition"
                    onClick={() => setIsInsumosOpen(!isInsumosOpen)}>
                    Insumos {isInsumosOpen ? "▼" : "▶"}
                </button>
                {isInsumosOpen && (
                    <div className="pl-4 mt-2 space-y-2">
                         <NavLink
                    to="/insumos/dieta"
                    className={({isActive}) =>
                    `block px-4 py-2 rounded ${isActive ? "bg-orange-500" : "hover:bg-gray-700"}`
                    }
                    >
                        Gestion de Dietas y Productos
                    </NavLink>

                    <NavLink
                    to="/historico/dieta"
                    className={({isActive}) =>
                    `block px-4 py-2 rounded ${isActive ? "bg-orange-500" : "hover:bg-gray-700"}`
                    }
                    >
                        Historico de Dietas y Productos
                    </NavLink>
                    </div>
                )}
                  
                </div>
            </nav>
        </aside>
    )
}