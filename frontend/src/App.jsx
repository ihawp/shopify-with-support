import { BrowserRouter, Routes, Route } from 'react-router-dom';


// Pages
import Home from './pages/Home';
import Support from './pages/Support';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Privacy from './pages/Privacy';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Middleware*
import SocketProvider from './middleware/SocketProvider';
import AdminLogin from './pages/AdminLogin';

export default function App() {
  return <>
    <BrowserRouter>

    <SocketProvider>

      <Header />

      <Routes>
        <Route path='/' element={ <Home /> } />

        <Route path='/support' element={ <Support /> } />
        <Route path='/cart' element={ <Cart /> } />
        <Route path='/product/:id' element={ <Product /> } />

        <Route path='/privacy' element={ <Privacy /> } />


        <Route path='/login' element={ <AdminLogin /> } />
      </Routes>

      <Footer />

    </SocketProvider>

    </BrowserRouter>
  </>;
}