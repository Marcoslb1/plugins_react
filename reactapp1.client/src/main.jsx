import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ModalProvider} from "./components/ModalSalut";

createRoot(document.getElementById('root')).render(
    <ModalProvider>
        <App />
    </ModalProvider>
)
