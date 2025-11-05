import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class BedService {
  constructor() {
    this.tableName = 'bed_c';
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
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "is_occupied_c"}},
          {"field": {"Name": "patient_id_c"}}
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
      console.error("Error fetching beds:", error?.response?.data?.message || error);
      toast.error("Failed to load beds");
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
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "is_occupied_c"}},
          {"field": {"Name": "patient_id_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching bed ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load bed");
      return null;
    }
  }

  async create(bedData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [{
          Name: bedData.Name || `Bed ${bedData.number_c}`,
          number_c: bedData.number_c,
          ward_c: bedData.ward_c,
          department_c: bedData.department_c,
          type_c: bedData.type_c,
          is_occupied_c: bedData.is_occupied_c || false,
          patient_id_c: bedData.patient_id_c
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
          console.error(`Failed to create ${failed.length} beds:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Bed created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating bed:", error?.response?.data?.message || error);
      toast.error("Failed to create bed");
      return null;
    }
  }

  async update(id, bedData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
          ...(bedData.Name && { Name: bedData.Name }),
          ...(bedData.number_c && { number_c: bedData.number_c }),
          ...(bedData.ward_c && { ward_c: bedData.ward_c }),
          ...(bedData.department_c && { department_c: bedData.department_c }),
          ...(bedData.type_c && { type_c: bedData.type_c }),
          ...(bedData.is_occupied_c !== undefined && { is_occupied_c: bedData.is_occupied_c }),
          ...(bedData.patient_id_c && { patient_id_c: bedData.patient_id_c })
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
          console.error(`Failed to update ${failed.length} beds:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Bed updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating bed:", error?.response?.data?.message || error);
      toast.error("Failed to update bed");
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
          console.error(`Failed to delete ${failed.length} beds:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Bed deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting bed:", error?.response?.data?.message || error);
      toast.error("Failed to delete bed");
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
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "is_occupied_c"}}
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
      console.error("Error fetching beds by department:", error?.response?.data?.message || error);
      toast.error("Failed to load beds");
      return [];
    }
  }

  async getAvailable() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "is_occupied_c"}}
        ],
        where: [{
          "FieldName": "is_occupied_c",
          "Operator": "EqualTo",
          "Values": [false]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching available beds:", error?.response?.data?.message || error);
      toast.error("Failed to load beds");
      return [];
    }
  }

  async getOccupied() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "is_occupied_c"}},
          {"field": {"Name": "patient_id_c"}}
        ],
        where: [{
          "FieldName": "is_occupied_c",
          "Operator": "EqualTo",
          "Values": [true]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching occupied beds:", error?.response?.data?.message || error);
      toast.error("Failed to load beds");
      return [];
    }
  }
}

export default new BedService();