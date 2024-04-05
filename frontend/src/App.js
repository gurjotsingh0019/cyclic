import Footer from './components/Footer';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
     <Header/>
     <main className=''>
          <Outlet />
      </main>
     <Footer/>
     <ToastContainer />
    </>
  );
}

export default App;
