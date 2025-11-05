import patientsData from "@/services/mockData/patients.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PatientService {
  constructor() {
    this.patients = [...patientsData];
  }

  async getAll() {
    await delay(300);
    return [...this.patients];
  }

  async getById(id) {
    await delay(200);
    const patient = this.patients.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    return { ...patient };
  }

  async create(patientData) {
    await delay(400);
    const newPatient = {
      Id: Math.max(...this.patients.map(p => p.Id), 0) + 1,
      ...patientData,
      status: patientData.status || "outpatient"
    };
    this.patients.push(newPatient);
    return { ...newPatient };
  }

  async update(id, patientData) {
    await delay(300);
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    this.patients[index] = { ...this.patients[index], ...patientData };
    return { ...this.patients[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Patient with ID ${id} not found`);
    }
    const deletedPatient = this.patients.splice(index, 1)[0];
    return { ...deletedPatient };
  }

  async getByStatus(status) {
    await delay(250);
    return this.patients.filter(p => p.status === status).map(p => ({ ...p }));
  }

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return this.patients
      .filter(p => 
        p.firstName.toLowerCase().includes(searchTerm) ||
        p.lastName.toLowerCase().includes(searchTerm) ||
        p.email.toLowerCase().includes(searchTerm) ||
        p.phone.includes(searchTerm)
      )
      .map(p => ({ ...p }));
  }
}

export default new PatientService();