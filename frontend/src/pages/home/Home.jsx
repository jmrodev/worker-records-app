import Button from '../../components/button/Button.jsx'
import Input from '../../components/input/Input.jsx'
import './Home.css'

const Home = () => {
  return (
    <>
      <h2>Ingreso - Egreso</h2>

      <div className="container">
        <div className="container__form">
          <h3>Ingreso</h3>
          <form>
            <Input type="number" placeholder="Legajo" />
            <Input type="number" placeholder="Clave" />
            <Button text="Enviar" />
          </form>
        </div>
      </div>
    </>
  )
}

export default Home