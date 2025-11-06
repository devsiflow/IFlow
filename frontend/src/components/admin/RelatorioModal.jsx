export default function RelatorioModal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-[90%] md:w-[600px] shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-400 hover:text-gray-200"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
