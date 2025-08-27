// utils/skeleton.utils.js
export function replaceSkeleton(el, { finalClasses = [], content = "" } = {}) {
  if (!el) return;

  // Añadir transición suave
  el.classList.add("transition-opacity", "duration-300");

  // Iniciar fade out
  el.classList.add("opacity-0");

  setTimeout(() => {
    // Quitar clases de skeleton comunes
    el.classList.remove(
      "h-6",
      "h-4",
      "w-40",
      "w-64",
      "w-8",
      "inline-block",
      "bg-gray-200",
      "animate-pulse",
      "rounded",
      "opacity-0"
    );

    // Añadir clases finales
    if (finalClasses.length) el.classList.add(...finalClasses);

    // Asignar contenido si se pasa
    if (content !== "") el.textContent = content;

    // Mostrar
    el.classList.add("opacity-100");
  }, 300); // ⏱️ duración coincide con Tailwind `duration-300`
}
