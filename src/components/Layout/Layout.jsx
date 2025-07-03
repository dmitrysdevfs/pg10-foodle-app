import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import css from './Layout.module.css';

export default function Layout() {
  return (
    <div className={css.wrapper}>
      <Header />
      <main className={css.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}