import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

import appointmentService from "@/services/api/appointmentService";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleAppointmentClick = (appointment) => {
    toast.info(`Opening appointment details for Patient ID: ${appointment.patientId}`);
  };

  const handleNewAppointment = () => {
    toast.info("Opening new appointment booking form");
  };

  const getStatusCounts = () => {
    return {
      all: appointments.length,
      scheduled: appointments.filter(a => a.status === "scheduled").length,
      completed: appointments.filter(a => a.status === "completed").length,
      cancelled: appointments.filter(a => a.status === "cancelled").length,
      "no-show": appointments.filter(a => a.status === "no-show").length
    };
  };

  const filteredAppointments = filterStatus === "all" 
    ? appointments 
    : appointments.filter(apt => apt.status === filterStatus);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAppointments} />;

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
            Appointment Scheduling
          </h1>
          <p className="text-gray-600 mt-1">
            Manage patient appointments and doctor schedules
          </p>
        </div>
        <Button onClick={handleNewAppointment}>
          <ApperIcon name="CalendarPlus" className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
            <ApperIcon name="Calendar" className="w-8 h-8 text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "scheduled" 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("scheduled")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.scheduled}</p>
            </div>
            <ApperIcon name="Clock" className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "completed" 
              ? "border-success bg-emerald-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("completed")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.completed}</p>
            </div>
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-success" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "cancelled" 
              ? "border-error bg-red-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("cancelled")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.cancelled}</p>
            </div>
            <ApperIcon name="X" className="w-8 h-8 text-error" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
            filterStatus === "no-show" 
              ? "border-warning bg-amber-50" 
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          onClick={() => setFilterStatus("no-show")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">No Show</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts["no-show"]}</p>
            </div>
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-warning" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </Select>
          
          <span className="text-sm text-gray-500">
            {filteredAppointments.length} appointments
          </span>
        </div>
      </div>

      {/* Calendar */}
      <AppointmentCalendar
        appointments={filteredAppointments}
        onAppointmentClick={handleAppointmentClick}
        onNewAppointment={handleNewAppointment}
      />
    </div>
  );
};

export default Appointments;