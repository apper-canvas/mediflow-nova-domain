import appointmentsData from "@/services/mockData/appointments.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData];
  }

  async getAll() {
    await delay(300);
    return [...this.appointments];
  }

  async getById(id) {
    await delay(200);
    const appointment = this.appointments.find(a => a.Id === parseInt(id));
    if (!appointment) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    return { ...appointment };
  }

  async create(appointmentData) {
    await delay(400);
    const newAppointment = {
      Id: Math.max(...this.appointments.map(a => a.Id), 0) + 1,
      ...appointmentData,
      status: appointmentData.status || "scheduled"
    };
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await delay(300);
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    this.appointments[index] = { ...this.appointments[index], ...appointmentData };
    return { ...this.appointments[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    const deletedAppointment = this.appointments.splice(index, 1)[0];
    return { ...deletedAppointment };
  }

  async getByDate(date) {
    await delay(250);
    return this.appointments.filter(a => a.date === date).map(a => ({ ...a }));
  }

  async getByPatient(patientId) {
    await delay(200);
    return this.appointments.filter(a => a.patientId === patientId).map(a => ({ ...a }));
  }

  async getByDoctor(doctorId) {
    await delay(200);
    return this.appointments.filter(a => a.doctorId === doctorId).map(a => ({ ...a }));
  }

  async getByStatus(status) {
    await delay(250);
    return this.appointments.filter(a => a.status === status).map(a => ({ ...a }));
  }
}

export default new AppointmentService();