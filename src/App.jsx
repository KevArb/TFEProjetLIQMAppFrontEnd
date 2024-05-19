import './App.css'
import { AuthProvider } from './components/LoginView/AuthProvider'
import LoginView from './components/LoginView/LoginView'

function App() {
  return (
    <>
      <AuthProvider>
          <LoginView />      
      </AuthProvider>
    </>
  )
}

export default App
