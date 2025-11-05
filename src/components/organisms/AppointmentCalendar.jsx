import { useState } from "react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import { cn } from "@/utils/cn";

const AppointmentCalendar = ({ appointments, onAppointmentClick, onNewAppointment }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week");

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const getAppointmentsForDay = (date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.date), date)
    );
  };

  const getAppointmentForTimeSlot = (date, time) => {
    return appointments.find(apt => 
      isSameDay(new Date(apt.date), date) && apt.time === time
    );
  };

  const navigateWeek = (direction) => {
    const newDate = addDays(currentDate, direction === "next" ? 7 : -7);
    setCurrentDate(newDate);
  };

  const AppointmentCard = ({ appointment }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-2 bg-gradient-to-r from-primary-50 to-cyan-50 border border-primary-200 rounded cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={() => onAppointmentClick(appointment)}
    >
      <div className="text-xs font-medium text-primary-900">
        Patient ID: {appointment.patientId}
      </div>
      <div className="text-xs text-primary-700 capitalize">
        {appointment.type}
      </div>
      <StatusBadge status={appointment.status} type="appointment" />
    </motion.div>
  );

  const WeekView = () => (
    <div className="grid grid-cols-8 gap-0 border border-gray-200 rounded-lg overflow-hidden">
      {/* Time column */}
      <div className="bg-gray-50 border-r border-gray-200">
        <div className="h-12 border-b border-gray-200 flex items-center justify-center text-sm font-medium text-gray-500">
          Time
        </div>
        {timeSlots.map(time => (
          <div key={time} className="h-16 border-b border-gray-200 flex items-center justify-center text-sm text-gray-600">
            {time}
          </div>
        ))}
      </div>

      {/* Day columns */}
      {weekDays.map(day => (
        <div key={day.toString()} className="border-r border-gray-200 last:border-r-0">
          <div className={cn(
            "h-12 border-b border-gray-200 flex flex-col items-center justify-center text-sm",
            isToday(day) ? "bg-primary-100 text-primary-900 font-semibold" : "bg-gray-50 text-gray-700"
          )}>
            <div className="font-medium">{format(day, "EEE")}</div>
            <div className="text-xs">{format(day, "MMM dd")}</div>
          </div>
          
          {timeSlots.map(time => {
            const appointment = getAppointmentForTimeSlot(day, time);
            return (
              <div key={time} className="h-16 border-b border-gray-200 p-1 bg-white hover:bg-gray-50 transition-colors">
                {appointment && <AppointmentCard appointment={appointment} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  const DayView = () => {
    const dayAppointments = getAppointmentsForDay(currentDate);
    
    return (
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {format(currentDate, "EEEE, MMMM dd, yyyy")}
          </h3>
          <div className="space-y-2">
            {timeSlots.map(time => {
              const appointment = getAppointmentForTimeSlot(currentDate, time);
              return (
                <div key={time} className="flex items-center space-x-4 p-2 rounded hover:bg-gray-50">
                  <div className="w-16 text-sm text-gray-600">{time}</div>
                  <div className="flex-1">
                    {appointment ? (
                      <AppointmentCard appointment={appointment} />
                    ) : (
                      <div className="text-sm text-gray-400">Available</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Appointments ({dayAppointments.length})
          </h3>
          <div className="space-y-3">
            {dayAppointments.map(appointment => (
              <div
                key={appointment.Id}
                className="p-3 border border-gray-200 rounded-md cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => onAppointmentClick(appointment)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{appointment.time}</span>
                  <StatusBadge status={appointment.status} type="appointment" />
                </div>
                <div className="text-sm text-gray-600">
                  Patient ID: {appointment.patientId}
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {appointment.type}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {view === "week" ? "Weekly Schedule" : "Daily Schedule"}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={view === "week" ? "primary" : "outline"}
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button
              size="sm"
              variant={view === "day" ? "primary" : "outline"}
              onClick={() => setView("day")}
            >
              Day
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigateWeek("prev")}
            >
              <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">
              {view === "week" 
                ? `${format(weekStart, "MMM dd")} - ${format(weekEnd, "MMM dd, yyyy")}`
                : format(currentDate, "EEEE, MMMM dd, yyyy")
              }
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigateWeek("next")}
            >
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </Button>
          </div>
          
          <Button onClick={onNewAppointment}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {view === "week" ? <WeekView /> : <DayView />}
    </Card>
  );
};

export default AppointmentCalendar;