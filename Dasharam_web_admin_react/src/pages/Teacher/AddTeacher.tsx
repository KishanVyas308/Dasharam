
import { TextField, Button, Container, Typography, List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { teachersAtom } from "../../state/teachersAtom";
import { addTeacher, deleteTeacher, getAllTeachers } from "../../backend/handleTeacher";

const StyledContainer = styled(Container)({
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});

const AddTeacher = () => {
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [teachers, setTeachers] = useRecoilState(teachersAtom);

  const handleAddTeacher = async () => {
    if (name && mobileNo) {
      await addTeacher(name, mobileNo);
      const updatedTeachers = await getAllTeachers(); // Fetch updated teachers list
      setTeachers(updatedTeachers);
      setName("");
      setMobileNo("");
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    await deleteTeacher(teacherId);
    const updatedTeachers = await getAllTeachers(); // Fetch updated teachers list
    setTeachers(updatedTeachers);
  };

  return (
    <StyledContainer maxWidth="sm">
      <Typography variant="h4" component="h2" gutterBottom>
        Add Teacher
      </Typography>
      <Box component="form" noValidate autoComplete="off" mb={4}>
        <TextField
          fullWidth
          label="Teacher Name"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Teacher Mobile No."
          variant="outlined"
          margin="normal"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleAddTeacher}
          sx={{ mt: 2 }}
        >
          Add Teacher
        </Button>
      </Box>
      <Typography variant="h5" component="h3" gutterBottom>
        Teacher List
      </Typography>
      <List>
        {teachers.map((teacher: any) => (
          <ListItem
            key={teacher.id}
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              mb: 2,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteTeacher(teacher.id)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            }
          >
            <ListItemText primary={`${teacher.name} - ${teacher.mobileNo}`} />
          </ListItem>
        ))}
      </List>
    </StyledContainer>
  );
};

export default AddTeacher;
