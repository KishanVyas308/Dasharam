import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { studentsAtom } from "../../state/studentsAtom";
import { addStudent, getAllStudents } from "../../backend/handleStudent";
import { stdSubAtom } from "../../state/stdSubAtom";
import { getAllStdSub } from "../../backend/subjectStdHandle";

import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { PersonAdd, AddCircleOutline } from "@mui/icons-material";

const AddStudent = () => {
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentMobileNo, setParentMobileNo] = useState("");
  const [grNo, setGrNo] = useState("");
  const [password, setPassword] = useState("");
  const [standardId, setStandardId] = useState("");

  const [students, setStudents] = useRecoilState(studentsAtom);
  const [standard, setStandard] = useRecoilState(stdSubAtom);

  async function fetchStandardsSub() {
    if (standard.length === 0) {
      const data = await getAllStdSub();
      setStandard(data);
    }
  }

  useEffect(() => {
    fetchStandardsSub();
  }, [standard]);

  const handleAddStudent = async () => {
    if (name && parentName && parentMobileNo && grNo && password && standardId) {
      await addStudent(name, parentName, parentMobileNo, grNo, password, standardId);
      const updatedStudents: any = await getAllStudents(); // Fetch updated students list
      setStudents(updatedStudents);
      setName("");
      setParentName("");
      setParentMobileNo("");
      setGrNo("");
      setPassword("");
      setStandardId("");
    }
    fetchStandardsSub();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }} color="primary" fontWeight="bold">
          <PersonAdd fontSize="large" sx={{ verticalAlign: "middle", mr: 1 }} />
          Add Student
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Student Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Parent Name"
              variant="outlined"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Parent Mobile No."
              variant="outlined"
              value={parentMobileNo}
              onChange={(e) => setParentMobileNo(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="GR No."
              variant="outlined"
              value={grNo}
              onChange={(e) => setGrNo(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="standard-label">Select Standard</InputLabel>
              <Select
                labelId="standard-label"
                label="Select Standard"
                value={standardId}
                onChange={(e) => setStandardId(e.target.value)}
                required
              >
                <MenuItem value="">
                  <em>Select Standard</em>
                </MenuItem>
                {standard.map((std: any) => (
                  <MenuItem key={std.id} value={std.id}>
                    {std.standard}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutline />}
              onClick={handleAddStudent}
              sx={{ py: 2 }}
            >
              Add Student
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AddStudent;
    