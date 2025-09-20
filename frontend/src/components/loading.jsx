import loadingGif from "../assets/pedreiro.gif";

function Loading() {
  return (
        <div className="p-6 text-center flex justify-center items-center min-h-screen min-w-screen">
          <img src={loadingGif} alt="Carregando..." className="w-[300px] h-[300px]" />
        </div>
  )
}

export default Loading;
