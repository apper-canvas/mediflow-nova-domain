import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

import patientService from "@/services/api/patientService";
import bedService from "@/services/api/bedService";
import departmentService from "@/services/api/departmentService";

const Admissions = () => {
  const [admittedPatients, setAdmittedPatients] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Admission form state
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [admissionForm, setAdmissionForm] = useState({
    patientId: "",
    department: "",
    bedId: "",
    admissionDate: format(new Date(), "yyyy-MM-dd"),
    assignedDoctor: "",
    notes: ""
  });

  const loadAdmissionsData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patients, beds, depts] = await Promise.all([
        patientService.getByStatus("admitted"),
        bedService.getAvailable(),
        departmentService.getAll()
      ]);

      setAdmittedPatients(patients);
      setAvailableBeds(beds);
      setDepartments(depts);
    } catch (err) {
      setError(err.message || "Failed to load admissions data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmissionsData();
  }, []);

  const handleAdmissionFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate admission process
      toast.success("Patient admitted successfully!");
      setShowAdmissionForm(false);
      setAdmissionForm({
        patientId: "",
        department: "",
        bedId: "",
        admissionDate: format(new Date(), "yyyy-MM-dd"),
        assignedDoctor: "",
        notes: ""
      });
      // Reload data
      loadAdmissionsData();
    } catch (err) {
      toast.error("Failed to admit patient: " + err.message);
    }
  };

  const handleDischarge = (patient) => {
    toast.info(`Initiating discharge process for ${patient.firstName} ${patient.lastName}`);
  };

  const handleTransfer = (patient) => {
    toast.info(`Opening transfer form for ${patient.firstName} ${patient.lastName}`);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadAdmissionsData} />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
            Patient Admissions
          </h1>
          <p className="text-gray-600 mt-1">
            Manage patient admissions, bed assignments, and discharges
          </p>
        </div>
        <Button onClick={() => setShowAdmissionForm(true)}>
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Admit Patient
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Currently Admitted</p>
              <p className="text-3xl font-bold text-gray-900">{admittedPatients.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-warning to-amber-400 flex items-center justify-center">
              <ApperIcon name="Bed" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Beds</p>
              <p className="text-3xl font-bold text-gray-900">{availableBeds.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-success to-emerald-400 flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Departments</p>
              <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-400 flex items-center justify-center">
              <ApperIcon name="Building" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Admission Form Modal */}
      {showAdmissionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Admit Patient
                </h3>
                <button
                  onClick={() => setShowAdmissionForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdmissionFormSubmit} className="space-y-4">
                <Input
                  label="Patient ID"
                  value={admissionForm.patientId}
                  onChange={(e) => setAdmissionForm({...admissionForm, patientId: e.target.value})}
                  placeholder="Enter patient ID"
                  required
                />

                <Select
                  label="Department"
                  value={admissionForm.department}
                  onChange={(e) => setAdmissionForm({...admissionForm, department: e.target.value})}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.Id} value={dept.name}>{dept.name}</option>
                  ))}
                </Select>

                <Select
                  label="Available Bed"
                  value={admissionForm.bedId}
                  onChange={(e) => setAdmissionForm({...admissionForm, bedId: e.target.value})}
                  required
                >
                  <option value="">Select Bed</option>
                  {availableBeds.map(bed => (
                    <option key={bed.Id} value={bed.Id}>
                      {bed.number} - {bed.ward} ({bed.type})
                    </option>
                  ))}
                </Select>

                <Input
                  type="date"
                  label="Admission Date"
                  value={admissionForm.admissionDate}
                  onChange={(e) => setAdmissionForm({...admissionForm, admissionDate: e.target.value})}
                  required
                />

                <Input
                  label="Assigned Doctor"
                  value={admissionForm.assignedDoctor}
                  onChange={(e) => setAdmissionForm({...admissionForm, assignedDoctor: e.target.value})}
                  placeholder="Enter doctor name"
                  required
                />

                <div className="flex space-x-4 pt-4">
                  <Button type="submit" className="flex-1">
                    Admit Patient
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdmissionForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Admitted Patients Table */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Currently Admitted Patients ({admittedPatients.length})
          </h3>
        </div>
        
        {admittedPatients.length === 0 ? (
          <div className="p-6 text-center">
            <ApperIcon name="Bed" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Admitted Patients
            </h3>
            <p className="text-gray-600 mb-4">
              There are currently no patients admitted to the hospital.
            </p>
            <Button onClick={() => setShowAdmissionForm(true)}>
              <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
              Admit First Patient
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admittedPatients.map((patient, index) => (
                  <motion.tr
                    key={patient.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-100 to-cyan-100 flex items-center justify-center">
                          <span className="text-primary-700 font-semibold text-sm">
                            {patient.firstName[0]}{patient.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: P{String(patient.Id).padStart(3, "0")}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.bedNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.assignedDoctor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(patient.admissionDate), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={patient.status} type="patient" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTransfer(patient)}
                      >
                        <ApperIcon name="ArrowRightLeft" className="w-4 h-4 mr-1" />
                        Transfer
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleDischarge(patient)}
                      >
                        <ApperIcon name="UserMinus" className="w-4 h-4 mr-1" />
                        Discharge
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Admissions;