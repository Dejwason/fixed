import { useEffect, useState } from "react";

// ... (zbytek App.jsx kódu byl vložen předtím z Canvasu, obsahuje localStorage)

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
    </div>
  );
}