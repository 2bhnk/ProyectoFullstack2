document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formContacto');
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const mensaje = document.getElementById('mensaje');
  const mensajeExito = document.getElementById('mensajeExito');
 
  
  const mostrarError = (input, elementoError, mensajeTexto) => {
    elementoError.textContent = mensajeTexto;
    elementoError.style.display = 'block';
    input.classList.add('input-invalido');
  };

  const limpiarError = (input, elementoError) => {
    elementoError.textContent = '';
    elementoError.style.display = 'none';
    input.classList.remove('input-invalido');
  };

  /* Validaciones */

  /* Nombre */
  const validarNombre = () => {
    const error = document.getElementById("errorNombre");
    if (nombre.value.trim().length < 3){
        mostrarError(nombre, error, "El nombre debe tener almenos 3 caracteres. ");
        return false;
    }
    limpiarError(nombre, error)
    return true;
  }
  /* correo (gracias gemini genuinamente no tenia idea de como hacerlo) */
  const validarEmail = () => {
    const error = document.getElementById('errorEmail');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email.value.trim())) {
      mostrarError(email, error, 'Ingresa un correo válido (ej: usuario@correo.com).');
      return false;
    }
    limpiarError(email, error);
    return true;
  };
  /* mensaje */
  const validarMensaje = () => {
    const error = document.getElementById('errorMensaje');
    if (mensaje.value.trim().length < 10) {
      mostrarError(mensaje, error, 'El mensaje debe contener al menos 10 caracteres.');
      return false;
    }
    limpiarError(mensaje, error);
    return true;
  };


  nombre.addEventListener('blur', validarNombre);
  email.addEventListener('blur', validarEmail);
  mensaje.addEventListener('input', validarMensaje);

  /* gracias gemini por explicarme los blur y input */
  nombre.addEventListener('blur', validarNombre);
  email.addEventListener('blur', validarEmail);
  mensaje.addEventListener('input', validarMensaje);

  /* evento envio */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const esNombreValido = validarNombre();
    const esEmailValido = validarEmail();
    const esMensajeValido = validarMensaje();

    if (esNombreValido && esEmailValido && esMensajeValido) {
      mensajeExito.textContent = '¡Mensaje enviado con éxito! Nos contactaremos pronto.';
      mensajeExito.style.display = 'block';
      form.reset();
    } else {
      mensajeExito.style.display = 'none';
    }
  });
  })

