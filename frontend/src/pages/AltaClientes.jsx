    import React, { useState, useEffect } from 'react';
    import { Container, TextField, Button, Grid, Typography } from '@mui/material';
    import { useLocation, useNavigate } from 'react-router-dom';

    const AltaCliente = () => {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [contacto, setContacto] = useState('');
    const [nombreContacto, setNombreContacto] = useState('');
    const [fechaIngreso, setFechaIngreso] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [direccionFiscal, setDireccionFiscal] = useState('');
    const [rut, setRut] = useState('');
    const [mail, setMail] = useState('');
    const [cronograma, setCronograma] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const clientId = searchParams.get('id');

    // Si se pasa el id en la URL, se asume que es una edición y se obtienen los datos del cliente
    useEffect(() => {
        if (clientId) {
        fetch(`http://localhost:8000/api/clientes/${clientId}/detalles/`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        })
            .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del cliente');
            }
            return response.json();
            })
            .then((data) => {
            setNombre(data.nombre);
            setDireccion(data.direccion);
            setContacto(data.contacto);
            setNombreContacto(data.nombre_contacto);
            setFechaIngreso(data.fecha_ingreso); // asegúrate de que tenga el formato "YYYY-MM-DD"
            setRazonSocial(data.razon_social);
            setDireccionFiscal(data.direccion_fiscal);
            setRut(data.rut);
            setMail(data.mail);
            setCronograma(data.cronograma);
            })
            .catch((error) => console.error(error));
        }
    }, [clientId]);

    const handleSubmit = async (event) => {
        event.preventDefault();


        const data = {
        nombre,
        direccion,
        contacto,
        nombre_contacto: nombreContacto,
        fecha_ingreso: fechaIngreso,
        razon_social: razonSocial,
        direccion_fiscal: direccionFiscal,
        rut,
        mail,
        cronograma,
        };

        // Si hay clientId, se actualiza; si no, se crea uno nuevo
        const url = clientId
        ? `http://localhost:8000/api/clientes/${clientId}/actualizar/`
        : 'http://localhost:8000/api/clientes/registro/';
        const method = clientId ? 'PATCH' : 'POST';

        try {
        const response = await fetch(url, {
            method,
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log(clientId ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
            navigate('/');
        } else {
            console.error('Error al enviar el formulario');
        }
        } catch (error) {
        console.error('Error de red:', error);
        }
    };

    return (
        <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
            {clientId ? 'Editar Cliente' : 'Alta Cliente'}
        </Typography>
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            {/* Nombre */}
            <Grid item xs={12}>
                <TextField
                label="Nombre"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                />
            </Grid>

            {/* Dirección */}
            <Grid item xs={12}>
                <TextField
                label="Dirección"
                fullWidth
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                />
            </Grid>

            {/* Contacto */}
            <Grid item xs={12}>
                <TextField
                label="Contacto"
                fullWidth
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                required
                />
            </Grid>

            {/* Nombre de Contacto */}
            <Grid item xs={12}>
                <TextField
                label="Nombre de Contacto"
                fullWidth
                value={nombreContacto}
                onChange={(e) => setNombreContacto(e.target.value)}
                required
                />
            </Grid>

            {/* Fecha de Ingreso */}
            <Grid item xs={12}>
                <TextField
                label="Fecha de Ingreso"
                type="date"
                fullWidth
                value={fechaIngreso}
                onChange={(e) => setFechaIngreso(e.target.value)}
                required
                InputLabelProps={{
                    shrink: true,
                }}
                />
            </Grid>

            {/* Razón Social */}
            <Grid item xs={12}>
                <TextField
                label="Razón Social"
                fullWidth
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
                required
                />
            </Grid>

            {/* Dirección Fiscal */}
            <Grid item xs={12}>
                <TextField
                label="Dirección Fiscal"
                fullWidth
                value={direccionFiscal}
                onChange={(e) => setDireccionFiscal(e.target.value)}
                required
                />
            </Grid>

            {/* RUT */}
            <Grid item xs={12}>
                <TextField
                label="RUT"
                fullWidth
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                required
                />
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
                <TextField
                label="Email"
                type="email"
                fullWidth
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
                />
            </Grid>

            {/* Cronograma */}
            <Grid item xs={12}>
                <TextField
                label="Cronograma"
                fullWidth
                multiline
                rows={4}
                value={cronograma}
                onChange={(e) => setCronograma(e.target.value)}
                />
            </Grid>

            {/* Botón de envío */}
            <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                {clientId ? 'Actualizar Cliente' : 'Crear Cliente'}
                </Button>
            </Grid>
            </Grid>
        </form>
        </Container>
    );
    };

    export default AltaCliente;
