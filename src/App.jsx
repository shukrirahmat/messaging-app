import styles from "./App.module.css";
import LoginForm from "./components/LoginForm";

function App() {

  return (
    <div className={styles.base}>
      <h1 className={styles.header}>ODIN TEXT</h1>
      <LoginForm/>
      <p className={styles.footer}>© shkrrhmt 2025</p>
    </div>
  )
}

export default App
