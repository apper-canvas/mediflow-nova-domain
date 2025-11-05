import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import PatientTable from "@/components/organisms/PatientTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

import patientService from "@/services/api/patientService";

const Patients = () => {
const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(err.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    let filtered = [...patients];

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(patient => patient.status === filterStatus);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(patient =>
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.phone.includes(query) ||
        (patient.department && patient.department.toLowerCase().includes(query))
      );
    }

    setFilteredPatients(filtered);
  }, [patients, filterStatus, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleViewPatient = (patient) => {
    toast.info(`Viewing details for ${patient.firstName} ${patient.lastName}`);
  };

  const handleEditPatient = (patient) => {
    toast.info(`Editing ${patient.firstName} ${patient.lastName}`);
  };

const handleNewPatient = () => {
    navigate("/patients/new");
  };

  const getStatusCounts = () => {
    return {
      all: patients.length,
      admitted: patients.filter(p => p.status === "admitted").length,
      outpatient: patients.filter(p => p.status === "outpatient").length,
      discharged: patients.filter(p => p.status === "discharged").length
    };
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
            Patient Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage patient records, admissions, and medical history
          </p>
        </div>
        <Button onClick={handleNewPatient}>
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Register Patient
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "all" 
              ? "border-primary-500 bg-primary-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("all")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
            <ApperIcon name="Users" className="w-8 h-8 text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "admitted" 
              ? "border-warning bg-amber-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("admitted")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admitted</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.admitted}</p>
            </div>
            <ApperIcon name="Bed" className="w-8 h-8 text-warning" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "outpatient" 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("outpatient")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outpatients</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.outpatient}</p>
            </div>
            <ApperIcon name="User" className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "discharged" 
              ? "border-success bg-emerald-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("discharged")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Discharged</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.discharged}</p>
            </div>
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-success" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-4">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="all">All Patients</option>
            <option value="admitted">Admitted</option>
            <option value="outpatient">Outpatients</option>
            <option value="discharged">Discharged</option>
          </Select>
          
          <span className="text-sm text-gray-500">
            {filteredPatients.length} of {patients.length} patients
          </span>
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search patients by name, email, phone, or department..."
          className="flex-1 max-w-md"
        />
      </div>

      {/* Patient Table */}
      {filteredPatients.length === 0 ? (
        <Empty
          title="No Patients Found"
          description={searchQuery ? "Try adjusting your search criteria." : "No patients match the selected filter."}
          actionLabel="Register New Patient"
          onAction={handleNewPatient}
          icon="Users"
        />
      ) : (
        <PatientTable
          patients={filteredPatients}
          onViewPatient={handleViewPatient}
          onEditPatient={handleEditPatient}
        />
      )}
    </div>
  );
};

export default Patients;