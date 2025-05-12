import "./Form.css"
import Button from '../../components/button/Button.jsx'
import Input from '../../components/input/Input.jsx'

const Form = () => {
    return (
        <>
            <h2 className='form-title'>Ingreso - Egreso</h2>

            <div className="container">
                <div className="container__form">
                    <h3 className='form-subtitle'>Ingreso</h3>
                    <form className="form">
                        <Input type="number" placeholder="Legajo" />
                        <Input type="number" placeholder="Clave" />
                        <Button
                            text="Enviar"
                            onClick={() => alert('Button clicked')}
                        />
                    </form>
                </div>
            </div>

        </>
    )

}
export default Form