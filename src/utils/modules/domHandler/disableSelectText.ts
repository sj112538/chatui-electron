export const disableSelect = () => {
  document.addEventListener("mousedown", (event) => event.preventDefault(), {
    capture: true,
    once: true
  });
};