import React, { useState, useMemo, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { teachersAtom } from "../../state/teachersAtom";
import { studentsAtom } from "../../state/studentsAtom";
import { stdSubAtom } from "../../state/stdSubAtom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addAttendance, checkAttendance } from "../../backend/handleAttandance";
import {
  Container,
  Typography,
  Grid as Grid2,
  TextField,
  MenuItem,
  Button,
  Paper,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { userAtom } from "../../state/userAtom";
import { UserRole } from "../../types/type";

const AddAttendance = () => {
  const teachers = useRecoilValue(teachersAtom);
  const students = useRecoilValue(studentsAtom);
  const stdSub = useRecoilValue(stdSubAtom);
  const user = useRecoilValue(userAtom);

  const [standardId, setStandardId] = useState<string>("");
  const [takenByTeacherId, setTakenByTeacherId] = useState<string>("");
  const [takenDate, setTakenDate] = useState<Date | null | undefined>(null);
  const [selectedStdStudents, setSelectedStdStudents] = useState<any>([]);
  const [isTakenAttendance, setIsTakenAttendance] = useState<boolean>(false);

  const filteredStudents = useMemo(() => {
    return students.filter((student: any) => student.standardId === standardId);
  }, [students, standardId]);

  useEffect(() => {
    if (!takenDate) {
      const today = new Date();
      setTakenDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    }
    if (teachers.length > 0 && user?.role === UserRole.Teacher && stdSub.length > 0) {
      console.log(stdSub);
      
      const stdid = stdSub.find((s: any) => s.classTeacherId === user.id);
      console.log(stdid);

      setStandardId(stdid.id);
      console.log(user);
      console.log(teachers);
      setTakenByTeacherId(user.id);
    }
  }, []);

  const fetchAttendance = async () => {
    if (standardId && takenDate) {
      const formattedDate = new Date(takenDate.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0];
      const attendanceData = await checkAttendance(standardId, formattedDate);
      if (attendanceData?.data) {
        setSelectedStdStudents(attendanceData.data[0].students);
        setIsTakenAttendance(true);
      }
      else {
        const studentsData = filteredStudents.map((student: any) => ({
          studentId: student.id,
          present: false,
        }));
        setSelectedStdStudents(studentsData);
        setIsTakenAttendance(false);
      }
    }
  };
  useEffect(() => {

    fetchAttendance();
  }, [standardId, takenDate, students]);

  const handleStdChange = (e: any) => {
    setStandardId(e.target.value || "");
  };



  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    const updatedStudents = selectedStdStudents.map((student: any) =>
      student.studentId === studentId
        ? { ...student, present: isPresent }
        : student
    );
    setSelectedStdStudents(updatedStudents);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Take Attendance
        </Typography>
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} sm={6}>
            <TextField
              select
              disabled={user?.role === UserRole.Teacher}
              label="Select Standard"
              value={standardId || ""}
              onChange={handleStdChange}
              fullWidth
              style={{ marginBottom: "16px" }}
            >
              <MenuItem value="">
                <em>Select Standard</em>
              </MenuItem>
              {stdSub.map((std: any) => (
                <MenuItem key={std.id} value={std.id}>
                  {std.standard}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <TextField
              select
              label="Select Teacher"
              disabled={user?.role === UserRole.Teacher}
              value={takenByTeacherId || ""}
              onChange={(e) => setTakenByTeacherId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">
                <em>Select Teacher</em>
              </MenuItem>
              {teachers.map((teacher: any) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <DatePicker
              selected={takenDate}
              onChange={(date: Date | null) => setTakenDate(new Date(date?.getFullYear() ?? 0, date?.getMonth() ?? 0, date?.getDate() ?? 0))}
              placeholderText="Select Date"
              className="input-field"
              dateFormat="dd/MM/yyyy"
              customInput={<TextField label="Select Date" fullWidth />}
            />
          </Grid2>
        </Grid2>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          Mark Attendance
        </Typography>

        <Box sx={{ mb: 4 }}>
          {filteredStudents.map((student: any) => (
            <Paper
              key={student.id}
              sx={{ p: 2, mb: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Typography>{student.name}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      selectedStdStudents.find((s: any) => s.studentId === student.id)
                        ?.present || false
                    }
                    onChange={(e) =>
                      handleAttendanceChange(student.id, e.target.checked)
                    }
                  />
                }
                label="Present"
              />
            </Paper>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              if (!takenDate) {
                console.error("Taken date is undefined");
                return;
              }
              const formattedDate = new Date(takenDate.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0];
              console.log({
                standardId,
                takenByTeacherId,
                takenDate: formattedDate,
                selectedStdStudents,
              });
              const res = await addAttendance(
                standardId,
                takenByTeacherId,
                formattedDate,
                selectedStdStudents
              );
            }}
          >
            {isTakenAttendance ? "Update Attendance" : "Submit Attendance"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddAttendance;
