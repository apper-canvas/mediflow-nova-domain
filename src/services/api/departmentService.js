import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class DepartmentService {
  constructor() {
    this.tableName = 'department_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "head_doctor_c"}},
          {"field": {"Name": "total_beds_c"}},
          {"field": {"Name": "occupied_beds_c"}},
          {"field": {"Name": "staff_count_c"}},
          {"field": {"Name": "floor_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching departments:", error?.response?.data?.message || error);
      toast.error("Failed to load departments");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "head_doctor_c"}},
          {"field": {"Name": "total_beds_c"}},
          {"field": {"Name": "occupied_beds_c"}},
          {"field": {"Name": "staff_count_c"}},
          {"field": {"Name": "floor_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load department");
      return null;
    }
  }

  async create(departmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [{
          Name: departmentData.Name || departmentData.name_c,
          name_c: departmentData.name_c,
          head_doctor_c: departmentData.head_doctor_c,
          total_beds_c: departmentData.total_beds_c,
          occupied_beds_c: departmentData.occupied_beds_c || 0,
          staff_count_c: departmentData.staff_count_c,
          floor_c: departmentData.floor_c
        }]
      };

      const response = await apperClient.createRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} departments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Department created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating department:", error?.response?.data?.message || error);
      toast.error("Failed to create department");
      return null;
    }
  }

  async update(id, departmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
          ...(departmentData.Name && { Name: departmentData.Name }),
          ...(departmentData.name_c && { name_c: departmentData.name_c }),
          ...(departmentData.head_doctor_c && { head_doctor_c: departmentData.head_doctor_c }),
          ...(departmentData.total_beds_c !== undefined && { total_beds_c: departmentData.total_beds_c }),
          ...(departmentData.occupied_beds_c !== undefined && { occupied_beds_c: departmentData.occupied_beds_c }),
          ...(departmentData.staff_count_c !== undefined && { staff_count_c: departmentData.staff_count_c }),
          ...(departmentData.floor_c && { floor_c: departmentData.floor_c })
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} departments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Department updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating department:", error?.response?.data?.message || error);
      toast.error("Failed to update department");
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Department deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting department:", error?.response?.data?.message || error);
      toast.error("Failed to delete department");
      return false;
    }
  }
}

export default new DepartmentService();