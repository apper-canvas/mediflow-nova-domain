import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class PatientService {
  constructor() {
    this.tableName = 'patient_c';
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
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "emergency_phone_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "assigned_doctor_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "department_c"}}
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
      console.error("Error fetching patients:", error?.response?.data?.message || error);
      toast.error("Failed to load patients");
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
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "emergency_phone_c"}},
          {"field": {"Name": "blood_group_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "assigned_doctor_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "department_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load patient");
      return null;
    }
  }

  async create(patientData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [{
          Name: patientData.Name || `${patientData.first_name_c} ${patientData.last_name_c}`,
          first_name_c: patientData.first_name_c,
          last_name_c: patientData.last_name_c,
          date_of_birth_c: patientData.date_of_birth_c,
          gender_c: patientData.gender_c,
          phone_c: patientData.phone_c,
          email_c: patientData.email_c,
          address_c: patientData.address_c,
          emergency_contact_c: patientData.emergency_contact_c,
          emergency_phone_c: patientData.emergency_phone_c,
          blood_group_c: patientData.blood_group_c,
          allergies_c: patientData.allergies_c,
          status_c: patientData.status_c || "outpatient",
          admission_date_c: patientData.admission_date_c,
          assigned_doctor_c: patientData.assigned_doctor_c,
          bed_number_c: patientData.bed_number_c,
          department_c: patientData.department_c
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
          console.error(`Failed to create ${failed.length} patients:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Patient created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating patient:", error?.response?.data?.message || error);
      toast.error("Failed to create patient");
      return null;
    }
  }

  async update(id, patientData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
          ...(patientData.Name && { Name: patientData.Name }),
          ...(patientData.first_name_c && { first_name_c: patientData.first_name_c }),
          ...(patientData.last_name_c && { last_name_c: patientData.last_name_c }),
          ...(patientData.date_of_birth_c && { date_of_birth_c: patientData.date_of_birth_c }),
          ...(patientData.gender_c && { gender_c: patientData.gender_c }),
          ...(patientData.phone_c && { phone_c: patientData.phone_c }),
          ...(patientData.email_c && { email_c: patientData.email_c }),
          ...(patientData.address_c && { address_c: patientData.address_c }),
          ...(patientData.emergency_contact_c && { emergency_contact_c: patientData.emergency_contact_c }),
          ...(patientData.emergency_phone_c && { emergency_phone_c: patientData.emergency_phone_c }),
          ...(patientData.blood_group_c && { blood_group_c: patientData.blood_group_c }),
          ...(patientData.allergies_c && { allergies_c: patientData.allergies_c }),
          ...(patientData.status_c && { status_c: patientData.status_c }),
          ...(patientData.admission_date_c && { admission_date_c: patientData.admission_date_c }),
          ...(patientData.assigned_doctor_c && { assigned_doctor_c: patientData.assigned_doctor_c }),
          ...(patientData.bed_number_c && { bed_number_c: patientData.bed_number_c }),
          ...(patientData.department_c && { department_c: patientData.department_c })
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
          console.error(`Failed to update ${failed.length} patients:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Patient updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating patient:", error?.response?.data?.message || error);
      toast.error("Failed to update patient");
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
          console.error(`Failed to delete ${failed.length} patients:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Patient deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting patient:", error?.response?.data?.message || error);
      toast.error("Failed to delete patient");
      return false;
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
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "assigned_doctor_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "department_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [status]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching patients by status:", error?.response?.data?.message || error);
      toast.error("Failed to load patients");
      return [];
    }
  }

  async search(query) {
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
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "department_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [query]},
                {"fieldName": "last_name_c", "operator": "Contains", "values": [query]},
                {"fieldName": "email_c", "operator": "Contains", "values": [query]},
                {"fieldName": "phone_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching patients:", error?.response?.data?.message || error);
      toast.error("Failed to search patients");
      return [];
    }
  }
}

export default new PatientService();