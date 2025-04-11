import { useEffect, useState } from "react";

export default function KartotekaApp() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("udaje");
  const [newPatientName, setNewPatientName] = useState("");
  const [newVisit, setNewVisit] = useState({ date: "", diagnosis: "", notes: "" });
  const [role, setRole] = useState("student");
  const [searchTerm, setSearchTerm] = useState("");
  const [newDocument, setNewDocument] = useState(null);
  const [newPrescription, setNewPrescription] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("patients");
    if (stored) setPatients(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  const addPatient = () => {
    if (newPatientName.trim() === "") return;
    setPatients([
      ...patients,
      {
        name: newPatientName,
        birthdate: "",
        age: "",
        gender: "",
        contact: "",
        address: "",
        visits: [],
        documents: [],
        notes: "",
        prescriptions: []
      }
    ]);
    setNewPatientName("");
  };

  const addVisit = () => {
    if (!newVisit.date || !newVisit.diagnosis) return;
    const updated = [...patients];
    updated[selectedPatientIndex].visits.push(newVisit);
    setPatients(updated);
    setNewVisit({ date: "", diagnosis: "", notes: "" });
  };

  const handleRoleChange = (e) => {
    if (prompt("Zadejte heslo pro roli učitele:") !== "ucitel123" && e.target.value === "teacher") {
      alert("Nesprávné heslo. Zůstáváte jako žák.");
      return;
    }
    setRole(e.target.value);
    setSelectedPatientIndex(null);
    setActiveTab("udaje");
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedPatientIndex !== null) {
      const updated = [...patients];
      updated[selectedPatientIndex].documents.push(file.name);
      setPatients(updated);
    }
  };

  const handleAddPrescription = () => {
    if (newPrescription.trim() === "") return;
    const updated = [...patients];
    updated[selectedPatientIndex].prescriptions.push(newPrescription);
    setPatients(updated);
    setNewPrescription("");
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const greenStyle = {
    backgroundColor: "#e8f5e9",
    border: "1px solid #a5d6a7",
    color: "#2e7d32"
  };

  const greenButton = {
    backgroundColor: "#66bb6a",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem 1rem",
    cursor: "pointer"
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", background: "#f1f8f4", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem", color: "#2e7d32" }}>🩺 Elektronická kartotéka</h1>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <label>Role: </label>
        <select value={role} onChange={handleRoleChange} style={{ padding: "0.5rem", marginLeft: "0.5rem" }}>
          <option value="student">Žák</option>
          <option value="teacher">Učitel</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        <div style={{ ...greenStyle, borderRadius: "8px", padding: "1rem" }}>
          <h2>Pacienti</h2>
          <input
            placeholder="Hledat pacienta"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "0.5rem", marginBottom: "1rem", width: "100%" }}
          />
          {role === "teacher" && (
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                placeholder="Jméno pacienta"
                style={{ flex: 1, padding: "0.5rem" }}
              />
              <button onClick={addPatient} style={greenButton}>Přidat</button>
            </div>
          )}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredPatients.map((p, index) => (
              <li
                key={index}
                style={{
                  padding: "0.5rem",
                  backgroundColor: selectedPatientIndex === index ? "#c8e6c9" : "#ffffff",
                  marginBottom: "0.5rem",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
                onClick={() => { setSelectedPatientIndex(index); setActiveTab("udaje"); }}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ ...greenStyle, borderRadius: "8px", padding: "1rem" }}>
          <h2>Karta pacienta</h2>
          {selectedPatientIndex === null ? (
            <p>Vyberte pacienta vlevo.</p>
          ) : (
            <>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <button onClick={() => setActiveTab("udaje")} style={greenButton}>Údaje</button>
                <button onClick={() => setActiveTab("navstevy")} style={greenButton}>Návštěvy</button>
                <button onClick={() => setActiveTab("dokumenty")} style={greenButton}>Dokumenty</button>
                <button onClick={() => setActiveTab("leky")} style={greenButton}>Předpis</button>
                <button onClick={() => setActiveTab("poznamky")} style={greenButton}>Poznámky</button>
              </div>
              <div>
                {activeTab === "udaje" && (
                  <>
                    <p><strong>Jméno:</strong> {patients[selectedPatientIndex].name}</p>
                    <p><strong>Datum narození:</strong> {patients[selectedPatientIndex].birthdate || "nezadáno"}</p>
                    <p><strong>Pohlaví:</strong> {patients[selectedPatientIndex].gender || "nezadáno"}</p>
                    <p><strong>Kontakt:</strong> {patients[selectedPatientIndex].contact || "nezadáno"}</p>
                    <p><strong>Adresa:</strong> {patients[selectedPatientIndex].address || "nezadáno"}</p>
                  </>
                )}
                {activeTab === "navstevy" && (
                  <>
                    <h4>Historie návštěv</h4>
                    <ul>
                      {patients[selectedPatientIndex].visits.map((v, i) => (
                        <li key={i}>
                          <strong>{v.date}</strong> – {v.diagnosis}
                          {v.notes && <em> ({v.notes})</em>}
                        </li>
                      ))}
                    </ul>
                    <input type="date" value={newVisit.date} onChange={e => setNewVisit({ ...newVisit, date: e.target.value })} />
                    <input type="text" placeholder="Diagnóza" value={newVisit.diagnosis} onChange={e => setNewVisit({ ...newVisit, diagnosis: e.target.value })} />
                    <input type="text" placeholder="Poznámky" value={newVisit.notes} onChange={e => setNewVisit({ ...newVisit, notes: e.target.value })} />
                    <button onClick={addVisit} style={greenButton}>Přidat návštěvu</button>
                  </>
                )}
                {activeTab === "dokumenty" && (
                  <>
                    <ul>
                      {patients[selectedPatientIndex].documents.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                    <input type="file" onChange={handleDocumentUpload} />
                  </>
                )}
                {activeTab === "leky" && (
                  <>
                    <ul>
                      {patients[selectedPatientIndex].prescriptions.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                    <input type="text" placeholder="Lék / předpis" value={newPrescription} onChange={e => setNewPrescription(e.target.value)} />
                    <button onClick={handleAddPrescription} style={greenButton}>Přidat předpis</button>
                  </>
                )}
                {activeTab === "poznamky" && (
                  <>
                    <p>{patients[selectedPatientIndex].notes || "Žádné poznámky."}</p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
