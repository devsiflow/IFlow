import backgroundImage from "../assets/backgroundImage.jpg";

function HomePage() {
  return (
    <section
      className="h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      data-aos="fade-in"
    >
    </section>
  );
}

export default HomePage;
