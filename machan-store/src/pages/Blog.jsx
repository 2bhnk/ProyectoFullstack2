export const Blog = () => {
  return (
    <main className="container my-5 text-center" style={{ maxWidth: '800px' }}>
      <article className="bg-white p-4 rounded shadow-sm border mb-5">
        <h1 className="mb-3 text-uppercase fw-bold">RIP Nakayama Festa</h1>
        <span className="badge bg-secondary mb-4">Actualización UmaNews</span>
        
        <img 
          src="images/NAKAFESTAIRL.jpg" 
          alt="Nakayama Festa" 
          className="img-fluid rounded mb-4 w-100" 
          style={{ maxHeight: '400px', objectFit: 'cover' }} 
        />
        
        <div className="text-start fs-5" style={{ lineHeight: '1.8' }}>
          <p>
            <strong>Adiós a una leyenda de la hípica: Fallece a los 20 años Nakayama Festa</strong>, ganador de la <strong>Takarazuka Kinen</strong> y protagonista en <strong>Longchamp</strong>.
          </p>
          
          <p>
            <strong>Hokkaidō, Japón</strong> — El mundo del turf y los seguidores de la hípica internacional despiden con profundo pesar a uno de sus grandes referentes. El semental y histórico corredor <strong>Nakayama Festa</strong> (ナカヤマフェスタ) falleció en la madrugada del <strong>23 de agosto de 2026</strong> a la edad de 20 años.
          </p>

          <p>
            De acuerdo con la información oficial compartida por el complejo <strong>Urakawa Yushun Village AERU</strong>, ubicado en Hokkaidō —lugar donde disfrutaba de su retiro como caballo de utilidad y exhibición—, el deceso se produjo a las 00:54 horas. El motivo de su fallecimiento fue <strong>incapacidad para mantenerse en pie debido a la extrema debilidad</strong> (起立不全), consecuencia de un deterioro en su salud que venía arrastrando desde principios de mes.
          </p>

          <h3 className="h4 fw-bold mt-4 mb-3 text-dark">Una campaña inolvidable: La gloria nacional y la hazaña en París</h3>
          
          <p>
            Nacido en 2006 e hijo del legendario <strong>Stay Gold</strong>, Nakayama Festa construyó una carrera deportiva inolvidable bajo la tutela del entrenador Yoshitaka Ninomiya. Su victoria más icónica a nivel doméstico llegó en el año <strong>2010 al conquistar el prestigioso G1 Takarazuka Kinen</strong>, imponiéndose con autoridad ante los mejores exponentes de su generación.
          </p>

          <p>
            Sin embargo, su nombre quedó grabado a fuego en los canales de la historia hípica de Japón gracias a su gesta en Europa. Ese mismo 2010, Nakayama Festa viajó a Francia para disputar el mítico <strong>Prix de l'Arc de Triomphe</strong> (Premio del Arco del Triunfo) en el hipódromo de Longchamp. En una carrera para el recuerdo, rozó la gloria eterna al cruzar la meta en un ajustadísimo <strong>segundo puesto</strong>, quedando muy cerca de conquistar el título más esquivo para la hípica japonesa hasta ese entonces.
          </p>

          <h3 className="h4 fw-bold mt-4 mb-3 text-dark">Un retiro tranquilo y un legado imborrable</h3>
          
          <p>
            Tras retirarse oficialmente de las pistas y concluir su etapa como reproductor en 2023, Nakayama Festa encontró en el santuario de Urakawa un hogar apacible donde pasó sus últimos años siendo cuidado por personal especializado y visitado constantemente por fanáticos del turf y de la cultura pop vinculada al mundo de los purasangres.
          </p>

          <p>
            A principios de agosto, el recinto había comunicado públicamente que el ejemplar presentaba altibajos y problemas de salud debido a su avanzada edad, desatando una cadena de buenos deseos y muestras de apoyo por parte de sus seguidores en todo el mundo, quienes lamentaron su partida este 23 de agosto.
          </p>

          <p className="fw-semibold mt-4">
            Con la partida de Nakayama Festa, la familia de los descendientes de Stay Gold pierde a otro de sus insignes exponentes, pero su espíritu combativo en la recta de Longchamp y su inolvidable victoria en la Takarazuka Kinen permanecerán por siempre en la memoria de los aficionados. Descansa en paz, leyenda.
          </p>
        </div>
      </article>

      <section className="bg-white p-4 rounded shadow-sm border text-start">
        <h3 className="mb-3">Aporta a la galería</h3>
        <p className="text-muted small">Sube tus mejores capturas de Nakayama Festa. (Pendiente de conexión a AWS S3).</p>
        
        <form className="mt-3">
          <div className="mb-3">
            <label htmlFor="imagenBlog" className="form-label fw-bold">Seleccionar imagen</label>
            <input className="form-control" type="file" id="imagenBlog" accept="image/*" />
          </div>
          <button type="button" className="btn text-white w-100 fw-bold" style={{ backgroundColor: '#5b4b7a' }}>
            Subir Imagen
          </button>
        </form>
      </section>
    </main>
  );
};  