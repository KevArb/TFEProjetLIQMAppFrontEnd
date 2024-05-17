import './App.css'
import { AuthProvider } from './components/LoginView/AuthProvider'
import LoginView from './components/LoginView/LoginView'

function App() {
  return (
    <>
      <AuthProvider>
        <div>
            <LoginView />
        </div>
      </AuthProvider>
    </>
  )
}

export default App
