// FormContext.js
import { create } from "zustand";

export const useFormStore = create((set) => ({
  data: {},
  updateData: (pageKey, values) =>
    set((state) => ({
      data: { ...state.data, [pageKey]: values },
    })),
  // Opcional: Puedes agregar un método para reiniciar el formulario o realizar otras operaciones
}));
