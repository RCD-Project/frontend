import TextInputs from '../components/TextInput';
import '../styles/AltaCliente.css';

const AltaCliente = () => {
    return (
        <section className='alta-cliente'>
            <div className='input-group'>
                Nombre: <TextInputs/>
            </div>
            <div className='input-group'>
                Direccion: <TextInputs />
            </div>
            <div className='input-group'>
                Contacto: <TextInputs/>
            </div>
            <div className='input-group'>
                Nombre de contacto: <TextInputs/>
            </div>
            <div className='input-group'>
                Razon social: <TextInputs/>
            </div>
            <div className='input-group'>
                Direccion fiscal: <TextInputs/>
            </div>
            <div className='input-group'>
                Root: <TextInputs/>
            </div>
            <div className='input-group'>
                Mail: <TextInputs/>
            </div>
            <div className='input-group'>
                Cronograma: <TextInputs/>
            </div>
        </section>
    );
};

export default AltaCliente;