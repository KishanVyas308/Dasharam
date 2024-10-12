import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { stdSubAtom } from "../../state/stdSubAtom";
import { teachersAtom } from "../../state/teachersAtom";
import { addTeacherIdsFromStdSub } from "../../backend/subjectStdHandle";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
} from "@mui/material";

const AssignTeacher = () => {
  const [standardId, setStandardId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const standards = useRecoilValue(stdSubAtom);
  const [teachers] = useRecoilState(teachersAtom);

  const handleAssignTeacher = async () => {
    if (standardId && subjectName && teacherId) {
      await addTeacherIdsFromStdSub(standardId, subjectName, teacherId);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Assign Teacher to Subject
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel id="standard-label">Select Standard</InputLabel>
        <Select
          labelId="standard-label"
          value={standardId}
          onChange={(e) => setStandardId(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {standards.map((standard: any) => (
            <MenuItem key={standard.id} value={standard.id}>
              {standard.standard}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="subject-label">Select Subject</InputLabel>
        <Select
          labelId="subject-label"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          disabled={!standardId}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {standards
            .find((std: any) => std.id === standardId)
            ?.subjects.map((subject: any) => (
              <MenuItem key={subject.name} value={subject.name}>
                {subject.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="teacher-label">Select Teacher</InputLabel>
        <Select
          labelId="teacher-label"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {teachers.map((teacher: any) => (
            <MenuItem key={teacher.id} value={teacher.id}>
              {teacher.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box mt={3}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleAssignTeacher}
        >
          Assign Teacher
        </Button>
      </Box>
    </Container>
  );
};

export default AssignTeacher;
