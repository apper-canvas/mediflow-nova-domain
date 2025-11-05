import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class AppointmentService {
  constructor() {
    this.tableName = 'appointment_c';
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
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
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
      console.error("Error fetching appointments:", error?.response?.data?.message || error);
      toast.error("Failed to load appointments");
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
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load appointment");
      return null;
    }
  }

  async create(appointmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [{
          Name: appointmentData.Name || `Appointment - ${appointmentData.patient_id_c}`,
          patient_id_c: appointmentData.patient_id_c,
          doctor_id_c: appointmentData.doctor_id_c,
          date_c: appointmentData.date_c,
          time_c: appointmentData.time_c,
          duration_c: appointmentData.duration_c,
          type_c: appointmentData.type_c,
          status_c: appointmentData.status_c || "scheduled",
          notes_c: appointmentData.notes_c
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
          console.error(`Failed to create ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Appointment created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating appointment:", error?.response?.data?.message || error);
      toast.error("Failed to create appointment");
      return null;
    }
  }

  async update(id, appointmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields
      const payload = {
        records: [{
          Id: parseInt(id),
          ...(appointmentData.Name && { Name: appointmentData.Name }),
          ...(appointmentData.patient_id_c && { patient_id_c: appointmentData.patient_id_c }),
          ...(appointmentData.doctor_id_c && { doctor_id_c: appointmentData.doctor_id_c }),
          ...(appointmentData.date_c && { date_c: appointmentData.date_c }),
          ...(appointmentData.time_c && { time_c: appointmentData.time_c }),
          ...(appointmentData.duration_c && { duration_c: appointmentData.duration_c }),
          ...(appointmentData.type_c && { type_c: appointmentData.type_c }),
          ...(appointmentData.status_c && { status_c: appointmentData.status_c }),
          ...(appointmentData.notes_c && { notes_c: appointmentData.notes_c })
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
          console.error(`Failed to update ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Appointment updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating appointment:", error?.response?.data?.message || error);
      toast.error("Failed to update appointment");
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
          console.error(`Failed to delete ${failed.length} appointments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Appointment deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting appointment:", error?.response?.data?.message || error);
      toast.error("Failed to delete appointment");
      return false;
    }
  }

  async getByDate(date) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "date_c",
          "Operator": "EqualTo",
          "Values": [date]
        }],
        orderBy: [{"fieldName": "time_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments by date:", error?.response?.data?.message || error);
      toast.error("Failed to load appointments");
      return [];
    }
  }

  async getByPatient(patientId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "patient_id_c",
          "Operator": "EqualTo",
          "Values": [patientId]
        }],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments by patient:", error?.response?.data?.message || error);
      toast.error("Failed to load appointments");
      return [];
    }
  }

  async getByDoctor(doctorId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "doctor_id_c",
          "Operator": "EqualTo",
          "Values": [doctorId]
        }],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments by doctor:", error?.response?.data?.message || error);
      toast.error("Failed to load appointments");
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
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [status]
        }],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching appointments by status:", error?.response?.data?.message || error);
      toast.error("Failed to load appointments");
      return [];
    }
  }
}

export default new AppointmentService();