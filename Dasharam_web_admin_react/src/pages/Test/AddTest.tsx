import React, { useState, useMemo, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { teastsAtom } from "../../state/testsAtom";
import { teachersAtom } from "../../state/teachersAtom";
import { studentsAtom } from "../../state/studentsAtom";
import { stdSubAtom } from "../../state/stdSubAtom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addTest } from "../../backend/handleTest";
import {
  Container,
  Typography,
  Grid as Grid2,
  TextField,
  MenuItem,
  Button,
  Paper,
  Box,
} from "@mui/material";
import { userAtom } from "../../state/userAtom";
import { UserRole } from "../../types/type";

const AddTest = () => {
  const [tests, setTests] = useRecoilState(teastsAtom);
  const teachers = useRecoilValue(teachersAtom);
  const students = useRecoilValue(studentsAtom);
  const stdSub = useRecoilValue(stdSubAtom);
  const user = useRecoilValue(userAtom);

  const [name, setName] = useState<string>("");
  const [standardId, setStandardId] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [takenByTeacherId, setTakenByTeacherId] = useState<string>("");
  const [totalMarks, setTotalMarks] = useState<string>("0");
  const [takenDate, setTakenDate] = useState<Date | null>(null);
  const [selectedStdStudents, setSelectedStdStudents] = useState<any>([]);

  useEffect(() => {
    if (!takenDate) {
      const today = new Date();
      setTakenDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    }
    if(user?.role === UserRole.Teacher && teachers.length > 0 && stdSub.length > 0) {
      const stdid = stdSub.find((s: any) => s.classTeacherId === user.id);
      setStandardId(stdid.id);
      setTakenByTeacherId(user.id);
      const selectedStudents = students
      .filter((student: any) => student.standardId === stdid.id)
      .map((student: any) => ({
        studentId: student.id,
        marks: "0",
      }));

    setSelectedStdStudents(selectedStudents);
    }
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student: any) => student.standardId === standardId);
  }, [students, standardId]);

  const handleStdChange = (e: any) => {
    const selectedStdId = e.target.value || "";
    setStandardId(selectedStdId);

    const selectedStudents = students
      .filter((student: any) => student.standardId === selectedStdId)
      .map((student: any) => ({
        studentId: student.id,
        marks: "0",
      }));

    setSelectedStdStudents(selectedStudents);
  };

  const handleMarksChange = (studentId: string, newMarks: string) => {
    const updatedStudents = selectedStdStudents.map((student: any) =>
      student.studentId === studentId
        ? { ...student, marks: newMarks || "0" }
        : student
    );
    setSelectedStdStudents(updatedStudents);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Test
        </Typography>
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} sm={6}>
            <TextField
              label="Test Name"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <TextField
              select
              label="Select Standard"
              value={standardId || ""}
              onChange={handleStdChange}
              fullWidth
              disabled={!user || user.role === "teacher"}
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
              label="Select Subject"
              value={subject || ""}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
             
            >
              <MenuItem value="">
                <em>Select Subject</em>
              </MenuItem>
              {stdSub
                .find((std: any) => std.id === standardId)
                ?.subjects.map((sub: any) => (
                  <MenuItem key={sub.name} value={sub.name}>
                    {sub.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <TextField
              select
              label="Select Teacher"
              value={takenByTeacherId || ""}
              onChange={(e) => setTakenByTeacherId(e.target.value)}
              fullWidth
              disabled={!user || user.role === "teacher"}
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
            <TextField
              type="number"
              label="Total Marks"
              value={totalMarks || "0"}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setTotalMarks(e.target.value)}
              fullWidth
            />
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <DatePicker
              selected={takenDate}
              onChange={(date: Date | null) => setTakenDate(date)}
              placeholderText="Select Date"
              className="input-field"
              dateFormat="dd/MM/yyyy"
              customInput={<TextField label="Select Date" fullWidth />}
            />
          </Grid2>
        </Grid2>

        <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 2 }}>
          Assign Marks to Students
        </Typography>

        <Box sx={{ mb: 4 }}>
          {filteredStudents.map((student: any) => (
            <Paper
              key={student.id}
              sx={{ p: 2, mb: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Typography>{student.name}</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  type="number"
                  size="small"
                  value={
                    selectedStdStudents.find((s: any) => s.studentId === student.id)
                      ?.marks || "0"
                  }
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleMarksChange(student.id, e.target.value)}
                  sx={{ width: 70, mr: 2 }}
                />
                <Typography>/ <span> </span> {totalMarks}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              console.log({
                name,
                standardId,
                subject,
                takenByTeacherId,
                totalMarks,
                takenDate,
                selectedStdStudents,
              });
              const res = await addTest(
                name,
                standardId,
                subject,
                takenByTeacherId,
                totalMarks,
                takenDate?.toISOString() || "",
                selectedStdStudents
              );
              if (res) {
                setTests([...tests, res]);
              }
            }}
          >
            Add Test
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddTest;
