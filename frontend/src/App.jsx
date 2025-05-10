import { BrowserRouter, Routes, Route } from 'react-router-dom';


// Pages
import Shop from './pages/Shop';
import Support from './pages/Support';
import Cart from './pages/Cart';
import Product from './pages/Product';
import Privacy from './pages/Privacy';
import AdminLogin from './pages/AdminLogin';
import Search from './pages/Search';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Middleware*
import SocketProvider from './middleware/SocketProvider';
import NavigationProvider from './middleware/NavigationProvider';
import CartProvider from './middleware/CartProvider';

export default function App() {
  return <>
    <BrowserRouter>

    <NavigationProvider>
    <SocketProvider>
    <CartProvider>

      <Header />

      <Routes>
        <Route path='/' element={ <Shop /> } />

        <Route path='/support' element={ <Support /> } />
        <Route path='/cart' element={ <Cart /> } />
        <Route path='/product/:id' element={ <Product /> } />

        <Route path='/search/:query' element={ <Search /> } />

        <Route path='/privacy' element={ <Privacy /> } />


        <Route path='/login' element={ <AdminLogin /> } />
      </Routes>

      <Footer />
      
    </CartProvider>
    </SocketProvider>
    </NavigationProvider>

    </BrowserRouter>
  </>;
}