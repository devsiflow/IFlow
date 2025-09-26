// import backgroundImage from "../assets/backgroundImage.jpg";
import iflowlogo from "../assets/iflowlogopngwhite.png";
import mitoVideo from "../assets/mito.mp4";


function HomePage() {
  return (
    
    // <section
    //   className="h-screen bg-cover bg-center flex items-center justify-center"
    //   style={{ backgroundImage: `url(${backgroundImage})` }}
    //   data-aos="fade-in"
    // >
    // </section>

        <section className="h-screen w-screen relative overflow-hidden" data-aos="fade-in">
      {/* Vídeo de fundo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src={mitoVideo} type="video/mp4" />
        Seu navegador não suporta vídeos HTML5.
      </video>

      {/* Conteúdo da página com a logo centralizada */}
      <div className="flex items-center justify-center h-full">
        <img
          src={iflowlogo}
          alt="Logo da Vorti Sea"
          className="w-[27.2rem] md:w-[34rem] lg:w-[40.8rem] object-contain"


        />
      </div>

      {/* Conteúdo da página */}
      <div className="flex items-center justify-center h-full">
        {/* Coloque aqui o conteúdo desejado */}
      </div>
    </section>
  );
}

export default HomePage;
