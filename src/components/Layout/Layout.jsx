import { Outlet } from 'react-router-dom';
import Header from '../Layout/Header/Header.jsx';
import Footer from '../Layout/Footer/Footer.jsx';

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
