// src/App.jsx
import { useEffect } from "react";
import { abrirModal } from "./components/ModalSalut";
function App() {

    function abrirMsg1() {
        abrirModal({
            tema: "feedback",
            titulo: "Modal 1",
            texto: "Primeira modal"
        });
    }
    return (
        <>
        </>
    );
}

export default App;
