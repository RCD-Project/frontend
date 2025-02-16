// pages/index.js
const forms = Object.values(import.meta.glob("./*.jsx", { eager: true })).map((mod) => mod.default);
export default forms;