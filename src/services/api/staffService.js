import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class StaffService {
  constructor() {
    this.tableName = 'staff_c';
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shift_start_c"}},
          {"field": {"Name": "shift_end_c"}}
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
      console.error("Error fetching staff:", error?.response?.data?.message || error);
      toast.error("Failed to load staff");
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "specialization_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shift_start_c"}},
          {"field": {"Name": "shift_end_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching staff member ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load staff member");
      return null;
    }
  }

  async create(staffData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [{
          Name: staffData.Name || `${staffData.first_name_c} ${staffData.last_name_c}`,
          first_name_c: staffData.first_name_c,
          last_name_c: staffData.last_name_c,
          role_c: staffData.role_c,
          specialization_c: staffData.specialization_c,
          department_c: staffData.department_c,
          phone_c: staffData.phone_c,
          email_c: staffData.email_c,
          status_c: staffData.status_c || "off-duty",
          shift_start_c: staffData.shift_start_c,
          shift_end_c: staffData.shift_end_c
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
          console.error(`Failed to create ${failed.length} staff members:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Staff member created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating staff member:", error?.response?.data?.message || error);
      toast.error("Failed to create staff member");
      return null;
    }
  }

  async update(id, staffData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
          ...(staffData.Name && { Name: staffData.Name }),
          ...(staffData.first_name_c && { first_name_c: staffData.first_name_c }),
          ...(staffData.last_name_c && { last_name_c: staffData.last_name_c }),
          ...(staffData.role_c && { role_c: staffData.role_c }),
          ...(staffData.specialization_c && { specialization_c: staffData.specialization_c }),
          ...(staffData.department_c && { department_c: staffData.department_c }),
          ...(staffData.phone_c && { phone_c: staffData.phone_c }),
          ...(staffData.email_c && { email_c: staffData.email_c }),
          ...(staffData.status_c && { status_c: staffData.status_c }),
          ...(staffData.shift_start_c && { shift_start_c: staffData.shift_start_c }),
          ...(staffData.shift_end_c && { shift_end_c: staffData.shift_end_c })
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
          console.error(`Failed to update ${failed.length} staff members:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Staff member updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating staff member:", error?.response?.data?.message || error);
      toast.error("Failed to update staff member");
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
          console.error(`Failed to delete ${failed.length} staff members:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Staff member deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting staff member:", error?.response?.data?.message || error);
      toast.error("Failed to delete staff member");
      return false;
    }
  }

  async getByDepartment(department) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "department_c",
          "Operator": "EqualTo", 
          "Values": [department]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching staff by department:", error?.response?.data?.message || error);
      toast.error("Failed to load staff");
      return [];
    }
  }

  async getByRole(role) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "role_c",
          "Operator": "EqualTo",
          "Values": [role]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching staff by role:", error?.response?.data?.message || error);
      toast.error("Failed to load staff");
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [status]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching staff by status:", error?.response?.data?.message || error);
      toast.error("Failed to load staff");
      return [];
    }
  }
}

export default new StaffService();