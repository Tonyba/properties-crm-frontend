import { Outlet, useNavigation } from 'react-router'
import { Header } from './ui/header/Header'


function App() {

  const navigation = useNavigation();

  return (
    <div className={`min-h-screen ${navigation.state == 'loading' ? 'loading' : ''}`} >
      <Header />
      <Outlet />
    </div>
  )
}

export default App
