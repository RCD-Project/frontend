// import React, { useContext } from "react";
// import { AuthContext } from "../pages/context/AuthContext";

// const TestRoleSelector = () => {
//   const { role, setRole } = useContext(AuthContext);
//   // Define los roles que quieres poder asignar para probar
//   const roles = ["superadmin", "cliente", "coordinadorlogistico", "coordinador", "tecnico", "supervisor"];

//   return (
//     <div style={{
//       position: "fixed",
//       bottom: "20px",
//       right: "20px",
//       zIndex: 1000,
//       background: "#fff",
//       padding: "0.5rem",
//       borderRadius: "4px",
//       boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
//     }}>
//       <label style={{ marginRight: "0.5rem" }}>Rol:</label>
//       <select value={role} onChange={(e) => setRole(e.target.value)}>
//         {roles.map((r) => (
//           <option key={r} value={r}>
//             {r}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default TestRoleSelector;
