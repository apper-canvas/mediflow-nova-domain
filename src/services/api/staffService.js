import staffData from "@/services/mockData/staff.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StaffService {
  constructor() {
    this.staff = [...staffData];
  }

  async getAll() {
    await delay(300);
    return [...this.staff];
  }

  async getById(id) {
    await delay(200);
    const member = this.staff.find(s => s.Id === parseInt(id));
    if (!member) {
      throw new Error(`Staff member with ID ${id} not found`);
    }
    return { ...member };
  }

  async create(staffData) {
    await delay(400);
    const newMember = {
      Id: Math.max(...this.staff.map(s => s.Id), 0) + 1,
      ...staffData,
      status: staffData.status || "off-duty"
    };
    this.staff.push(newMember);
    return { ...newMember };
  }

  async update(id, staffData) {
    await delay(300);
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Staff member with ID ${id} not found`);
    }
    this.staff[index] = { ...this.staff[index], ...staffData };
    return { ...this.staff[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Staff member with ID ${id} not found`);
    }
    const deletedMember = this.staff.splice(index, 1)[0];
    return { ...deletedMember };
  }

  async getByDepartment(department) {
    await delay(250);
    return this.staff.filter(s => s.department === department).map(s => ({ ...s }));
  }

  async getByRole(role) {
    await delay(200);
    return this.staff.filter(s => s.role === role).map(s => ({ ...s }));
  }

  async getByStatus(status) {
    await delay(200);
    return this.staff.filter(s => s.status === status).map(s => ({ ...s }));
  }
}

export default new StaffService();