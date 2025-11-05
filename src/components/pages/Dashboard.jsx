import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";
import staffService from "@/services/api/staffService";
import departmentService from "@/services/api/departmentService";

const Dashboard = () => {
  const [data, setData] = useState({
    patients: [],
    appointments: [],
    staff: [],
    departments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patients, appointments, staff, departments] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        staffService.getAll(),
        departmentService.getAll()
      ]);

      setData({ patients, appointments, staff, departments });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = {
    totalPatients: data.patients.length,
    admittedPatients: data.patients.filter(p => p.status === "admitted").length,
    todayAppointments: data.appointments.filter(a => a.date === format(new Date(), "yyyy-MM-dd")).length,
    onDutyStaff: data.staff.filter(s => s.status === "on-duty").length,
    totalBeds: data.departments.reduce((sum, dept) => sum + dept.totalBeds, 0),
    occupiedBeds: data.departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0)
  };

  const recentAppointments = data.appointments
    .filter(a => a.status === "scheduled")
    .slice(0, 5);

  const urgentPatients = data.patients
    .filter(p => p.status === "admitted")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
            Healthcare Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), "EEEE, MMMM do, yyyy")} - Overview of hospital operations
          </p>
        </div>
        <Button>
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Admitted"
          value={stats.admittedPatients}
          icon="Bed"
          color="warning"
          trend="up"
          trendValue="+3"
        />
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon="Calendar"
          color="primary"
          trend="down"
          trendValue="-2"
        />
        <StatCard
          title="On-Duty Staff"
          value={stats.onDutyStaff}
          icon="UserCheck"
          color="success"
          trend="stable"
          trendValue="100%"
        />
        <StatCard
          title="Bed Occupancy"
          value={`${Math.round((stats.occupiedBeds / stats.totalBeds) * 100)}%`}
          icon="Activity"
          color={stats.occupiedBeds / stats.totalBeds > 0.8 ? "error" : "success"}
          trend={stats.occupiedBeds / stats.totalBeds > 0.8 ? "up" : "down"}
          trendValue={`${stats.occupiedBeds}/${stats.totalBeds}`}
        />
        <StatCard
          title="Departments"
          value={data.departments.length}
          icon="Building"
          color="primary"
          trend="stable"
          trendValue="Active"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Today's Appointments
            </h3>
            <Button size="sm" variant="outline">
              <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-100 to-cyan-100 flex items-center justify-center">
                    <ApperIcon name="Clock" className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.time}
                    </p>
                    <p className="text-xs text-gray-500">
                      Patient ID: {appointment.patientId}
                    </p>
                  </div>
                </div>
                <StatusBadge status={appointment.status} type="appointment" />
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Admitted Patients */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Admitted Patients
            </h3>
            <Button size="sm" variant="outline">
              <ApperIcon name="Users" className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {urgentPatients.map((patient, index) => (
              <motion.div
                key={patient.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-100 to-cyan-100 flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-sm">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {patient.department} - {patient.bedNumber}
                    </p>
                  </div>
                </div>
                <StatusBadge status={patient.status} type="patient" />
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Department Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Department Overview
            </h3>
            <Button size="sm" variant="outline">
              <ApperIcon name="Building" className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {data.departments.slice(0, 5).map((department, index) => {
              const occupancyRate = Math.round((department.occupiedBeds / department.totalBeds) * 100);
              
              return (
                <motion.div
                  key={department.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-100 to-cyan-100 flex items-center justify-center">
                      <ApperIcon name="Building" className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {department.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {department.occupiedBeds}/{department.totalBeds} beds
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${
                    occupancyRate >= 90 ? "text-error" :
                    occupancyRate >= 70 ? "text-warning" :
                    "text-success"
                  }`}>
                    {occupancyRate}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
            <ApperIcon name="UserPlus" className="w-8 h-8 mb-2 text-primary-600" />
            <span>Admit Patient</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
            <ApperIcon name="CalendarPlus" className="w-8 h-8 mb-2 text-primary-600" />
            <span>Schedule Appointment</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
            <ApperIcon name="FileText" className="w-8 h-8 mb-2 text-primary-600" />
            <span>Medical Records</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
            <ApperIcon name="BarChart3" className="w-8 h-8 mb-2 text-primary-600" />
            <span>Reports</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;