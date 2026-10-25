export const Blog = () => {
  return (
    <main className="container my-5 text-center" style={{ maxWidth: '800px' }}>
      <article className="bg-white p-4 rounded shadow-sm border mb-5">
        <h1 className="mb-3 text-uppercase fw-bold">RIP Nakayama Festa</h1>
        <span className="badge bg-secondary mb-4">Actualización UmaNews</span>
        
        <img 
          src="images/RIPNakayamaFesta.webp" 
          alt="Nakayama Festa" 
          className="img-fluid rounded mb-4 w-100" 
          style={{ maxHeight: '400px', objectFit: 'cover' }} 
        />
        
        <p className="text-start fs-5" style={{ lineHeight: '1.8' }}>
          Hoy nos despedimos de una leyenda de las pistas. Nakayama Festa ha dejado una marca imborrable en el corazón de todos los entrenadores. Sus carreras llenas de intensidad y su espíritu indomable siempre serán recordados en la comunidad de Umamusume.
        </p>
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