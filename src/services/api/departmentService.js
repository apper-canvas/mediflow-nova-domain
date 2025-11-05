import departmentsData from "@/services/mockData/departments.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DepartmentService {
  constructor() {
    this.departments = [...departmentsData];
  }

  async getAll() {
    await delay(300);
    return [...this.departments];
  }

  async getById(id) {
    await delay(200);
    const department = this.departments.find(d => d.Id === parseInt(id));
    if (!department) {
      throw new Error(`Department with ID ${id} not found`);
    }
    return { ...department };
  }

  async create(departmentData) {
    await delay(400);
    const newDepartment = {
      Id: Math.max(...this.departments.map(d => d.Id), 0) + 1,
      ...departmentData,
      occupiedBeds: departmentData.occupiedBeds || 0
    };
    this.departments.push(newDepartment);
    return { ...newDepartment };
  }

  async update(id, departmentData) {
    await delay(300);
    const index = this.departments.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Department with ID ${id} not found`);
    }
    this.departments[index] = { ...this.departments[index], ...departmentData };
    return { ...this.departments[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.departments.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Department with ID ${id} not found`);
    }
    const deletedDepartment = this.departments.splice(index, 1)[0];
    return { ...deletedDepartment };
  }
}

export default new DepartmentService();