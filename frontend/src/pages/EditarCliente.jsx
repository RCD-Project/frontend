import TextInputs from '../components/TextInput';
import { useNavigate } from 'react-router-dom';
import { Button, TickIcon, Alert} from 'evergreen-ui';
import { useState } from 'react';
import '../styles/AltaCliente.css';

const EditarCliente = () => {
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
            <div className="custom-icon-contain">
            <Button 
                className='custom-edit-icon' 
                iconBefore={TickIcon} 
                onClick={() => navigate(`/`)}
            >
                Enviar
            </Button>
            </div>
        </section>
    );
};

export default EditarCliente;