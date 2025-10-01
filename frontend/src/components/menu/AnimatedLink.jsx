export default function AnimatedLink({ children, ...props }) {
  return (
    <a {...props} className="relative group">
      <span className="inline-block">{children}</span>
      <span className="absolute bottom-[-2px] left-1/2 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
    </a>
  );
}
