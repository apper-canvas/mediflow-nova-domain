import bedsData from "@/services/mockData/beds.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BedService {
  constructor() {
    this.beds = [...bedsData];
  }

  async getAll() {
    await delay(300);
    return [...this.beds];
  }

  async getById(id) {
    await delay(200);
    const bed = this.beds.find(b => b.Id === parseInt(id));
    if (!bed) {
      throw new Error(`Bed with ID ${id} not found`);
    }
    return { ...bed };
  }

  async create(bedData) {
    await delay(400);
    const newBed = {
      Id: Math.max(...this.beds.map(b => b.Id), 0) + 1,
      ...bedData,
      isOccupied: bedData.isOccupied || false,
      patientId: bedData.patientId || null
    };
    this.beds.push(newBed);
    return { ...newBed };
  }

  async update(id, bedData) {
    await delay(300);
    const index = this.beds.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Bed with ID ${id} not found`);
    }
    this.beds[index] = { ...this.beds[index], ...bedData };
    return { ...this.beds[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.beds.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Bed with ID ${id} not found`);
    }
    const deletedBed = this.beds.splice(index, 1)[0];
    return { ...deletedBed };
  }

  async getByDepartment(department) {
    await delay(250);
    return this.beds.filter(b => b.department === department).map(b => ({ ...b }));
  }

  async getAvailable() {
    await delay(200);
    return this.beds.filter(b => !b.isOccupied).map(b => ({ ...b }));
  }

  async getOccupied() {
    await delay(200);
    return this.beds.filter(b => b.isOccupied).map(b => ({ ...b }));
  }
}

export default new BedService();