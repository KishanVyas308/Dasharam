import { useRecoilState } from "recoil";
import { studentsAtom } from "../../state/studentsAtom";
import { stdSubAtom } from "../../state/stdSubAtom";
import { useEffect, useState } from "react";
import { deleteStudent, getAllStudents } from "../../backend/handleStudent";
import { getAllStdSub } from "../../backend/subjectStdHandle";

import {
  Container,
  Typography,
  Grid,
  Paper,
  IconButton,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";

const StandardTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
  color: "black"
}));

const ManageStudent = () => {
  const [students, setStudents] = useRecoilState<any>(studentsAtom);
  const [subjects, setSubjects] = useRecoilState(stdSubAtom);

  async function fetchStudents() {
    if (students.length === 0) {
      const data = await getAllStudents();
      setStudents(data);
    }
    if (subjects.length === 0) {
      const data = await getAllStdSub();
      setSubjects(data);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = async (studentId: string, subjectId: string) => {
    await deleteStudent(studentId, subjectId);
    const updatedStudents = await getAllStudents();
    setStudents(updatedStudents);
    const updatedSubjects = await getAllStdSub();
    setSubjects(updatedSubjects);
  };

  return (
    <Container>
      <Box py={5}>
        <Typography variant="h3" color="primary" gutterBottom>
          Manage Students
        </Typography>

        {subjects.map((subject: any) => (
          <Box key={subject.id} mb={4}>
            <StandardTitle variant="h5">{subject.standard}</StandardTitle>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {subject.students.map((id: any) => {
                const student = students.find((student: any) => student.id === id);
                return (
                  <Grid item xs={12} sm={6} md={4} key={id}>
                    <Card variant="outlined" sx={{ backgroundColor: "#f9f9f9" }}>
                      <CardContent className="flex justify-between items-center ">
                        <Typography variant="h6" >
                          {student?.name || "Unknown Student"}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteStudent(id, subject.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                       
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ManageStudent;
