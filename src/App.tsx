import { Outlet, useNavigation } from 'react-router'
import { Header } from './ui/header/Header'
import { Offcanvas } from './components/Offcanvas';

function App() {

  const navigation = useNavigation();

  return (
    <div className={`min-h-screen ${navigation.state == 'loading' ? 'loading' : ''}`} >
      <Header />
      <Outlet />
      <Offcanvas />
    </div>
  )
}

export default App
