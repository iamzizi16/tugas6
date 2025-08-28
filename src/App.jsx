import { useState, useTransition, useOptimistic } from "react";
import "./App.css"; // Import CSS manual

function App() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("");
  const [peserta, setPeserta] = useState([]);
  const [optimisticPeserta, addOptimisticPeserta] = useOptimistic(
    peserta,
    (state, newPeserta) => [...state, newPeserta]
  );

  const validate = () => {
    if (!nama) return "Nama wajib diisi";
    if (!email.includes("@")) return "Email tidak valid";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setStatus(error);
      return;
    }

    startTransition(() => {
      const newPeserta = { nama, email };
      addOptimisticPeserta(newPeserta);
      setTimeout(() => {
        setPeserta((prev) => [...prev, newPeserta]);
        setStatus("Pendaftaran berhasil!");
        setNama("");
        setEmail("");
      }, 1500);
    });
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Formulir Pendaftaran</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Daftar"}
          </button>
        </form>

        {status && <p className="status">{status}</p>}

        <h3>Daftar Peserta:</h3>
        <ul>
          {optimisticPeserta.map((p, i) => (
            <li key={i}>
              <span>{p.nama}</span> - <span className="email">{p.email}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
