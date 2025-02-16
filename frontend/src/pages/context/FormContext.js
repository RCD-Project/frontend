import { create } from "zustand";

// Estado global del formulario
export const useFormStore = create((set) => ({
  data: {}, // Aquí se almacenarán los datos de todas las páginas
  updateData: (pageIndex, values) =>
    set((state) => ({
      data: { ...state.data, [pageIndex]: values },
    })),
}));
