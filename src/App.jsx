import styles from "./App.module.css";
import {Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

function App() {

  return (
    <div className={styles.base}>
      <h1 className={styles.header}><Link to="/">ODIN TEXT</Link></h1>
      <Outlet/>
      <p className={styles.footer}>© shkrrhmt 2025</p>
    </div>
  )
}

export default App
