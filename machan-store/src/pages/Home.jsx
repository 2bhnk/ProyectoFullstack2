import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <main className="inicio-contenido">
      <section className="bloque-presentacion" aria-labelledby="titulo-presentacion">
        <div className="presentacion-texto">
          <h1 id="titulo-presentacion">🥕 Sobre nosotros</h1>
          <p>En <strong>MachanStore</strong> entendemos la emoción de conseguir lo que buscas.</p>
          <p>Somos un grupo de jóvenes entusiastas de la compra y venta de artículos, especialmente de productos de Umamusume.</p>
        </div>
        <div className="marco-imagen marco-imagen-presentacion">
          <img 
            src="images/LogoMachan.png" 
            alt="Logo de la tienda MachanStore" 
            className="img-fluid mx-auto d-block" 
            style={{ maxWidth: '300px', height: 'auto' }}
          />
        </div>
      </section>

      <section className="noticias-inicio" aria-labelledby="titulo-noticias">
        <h2 id="titulo-noticias">🥕 UmaNews 🥕</h2>
        <div className="noticias-grid">
          <article className="noticia-inicio">
            <Link to="/blog" className="text-decoration-none text-dark">
              <div className="marco-imagen marco-imagen-noticia">
                <img src="images/RIPNakayamaFesta.webp" alt="Noticia sobre Nakayama Festa" className="img-fluid" />
              </div>
              <h3>RIP Nakayama Festa</h3>
            </Link>
          </article>
          <article className="noticia-inicio">
            <Link to="/blog" className="text-decoration-none text-dark">
              <div className="marco-imagen marco-imagen-noticia">
                <img src="images/BannerAstonMachan.jpg" alt="Nuevo banner de Aston Machan" className="img-fluid" />
              </div>
              <h3>Nuevo banner de Aston Machan</h3>
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
};