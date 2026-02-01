import { Navigate, Outlet, useNavigation } from 'react-router'
import { Header } from './ui/header/Header'
import { Offcanvas } from './components/Offcanvas';
import { useUser } from './hooks/useUser';

function App() {

  const navigation = useNavigation();
  const { data: user, isPending } = useUser();

  console.log(user)

  return (
    <div className={`min-h-screen ${navigation.state == 'loading' ? 'loading' : ''}`} >
      {isPending ? null : (user ? <>
        <Header />
        <Outlet />
        <Offcanvas />
      </> : <Navigate to="/login" />)}
    </div>
  )
}

export default App
