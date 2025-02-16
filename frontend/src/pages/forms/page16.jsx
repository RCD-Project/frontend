import { useState } from "react";

function Page2({ defaultValues, saveData }) {
  const [formData, setFormData] = useState(defaultValues);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Formulario - Página 2</h2>
      <label>
        Nombre:
        <input type="text" name="nombre" value={formData.nombre || ""} onChange={handleChange} />
      </label>
      <button onClick={() => saveData(formData)}>Guardar</button>
    </div>
  );
}

export default Page2;
