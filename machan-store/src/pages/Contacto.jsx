import { useState } from 'react';

export const Contacto = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState('');

  const validar = () => {
    const nuevosErrores = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nombre.trim().length < 3) {
      nuevosErrores.nombre = 'Por favor ingresa tu nombre completo (mínimo 3 caracteres).';
    }
    if (!regexEmail.test(email.trim())) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido.';
    }
    if (mensaje.trim().length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe contener al menos 10 caracteres.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setExito('');
    if (validar()) {
      setExito('¡Tu consulta ha sido enviada con éxito! Te responderemos a la brevedad.');
      setNombre('');
      setEmail('');
      setMensaje('');
    }
  };

  return (
    <main>
      <section id="contacto">
        <h2>{"𓇼 ⋆. Ponte en contacto con nosotros ( ˘͈ ᵕ ˘͈♡)"}</h2>
        <p>¿Buscas una figura en específico? ¿Tienes dudas sobre tu envío? Entonces...</p>
        <p>¡Escríbenos! El MachanStore Team te ayudará.</p>

        <ul className="lista-contacto">
          <li>
            <b>Correo Electrónico:</b>
            <br />
            contacto@machanstore.cl
          </li>
          <li>
            <b>WhatsApp:</b>
            <br />
            +56 9 1234 5678
          </li>
          <li>
            <b>Instagram:</b>
            <br />
            @machan_store
          </li>
          <li>
            <b>Horario de atención:</b>
            <br />
            Lunes a Viernes de 10:00 a 19:00 hrs.
          </li>
        </ul>

        <h2>{"Mándanos tu información y te contactamos ദ്ദി ˉ͈̀꒳ˉ͈́ )✧"}</h2>

        <form id="formContacto" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              className={errores.nombre ? 'input-invalido' : ''}
              placeholder="Javier Santiago Tapia Toledo"
              maxLength="100"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errores.nombre && (
              <small className="mensaje-error" style={{ display: 'block' }}>
                {errores.nombre}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico:</label>
            <input
              type="email"
              id="email"
              className={errores.email ? 'input-invalido' : ''}
              placeholder="usuario@correo.com"
              maxLength="100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errores.email && (
              <small className="mensaje-error" style={{ display: 'block' }}>
                {errores.email}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              rows="4"
              className={errores.mensaje ? 'input-invalido' : ''}
              placeholder="Escribe al menos 10 caracteres..."
              maxLength="500"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            ></textarea>
            {errores.mensaje && (
              <small className="mensaje-error" style={{ display: 'block' }}>
                {errores.mensaje}
              </small>
            )}
          </div>

          <button type="submit">Enviar Consulta</button>

          {exito && (
            <div className="mensaje-exito" style={{ display: 'block' }}>
              {exito}
            </div>
          )}
        </form>
      </section>
    </main>
  );
};