import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { stdSubAtom } from "../../state/stdSubAtom";
import {
  addStandard,
  addSubjectsInStandard,
  deleteStandard,
  getAllStdSub,
  removeSubjectFromStandard,
  updateStandardName,
} from "../../backend/subjectStdHandle";
import { teachersAtom } from "../../state/teachersAtom";
import { getAllTeachers } from "../../backend/handleTeacher";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";

const TestSubjectStdPage = () => {
  const [stdSubState, setStdSubState] = useRecoilState<any>(stdSubAtom);
  const [teachers, setTeachers] = useRecoilState(teachersAtom);

  const [addStdText, setAddStdText] = useState("");
  const [addSubjTexts, setAddSubjTexts] = useState<any>([]);

  const [isEditStdName, setIsEditStdName] = useState(false);
  const [editStdName, setEditStdName] = useState("");
  const [editStdId, setEditStdId] = useState("");

  async function setUp() {
    const allStdSub = await getAllStdSub();
    if (allStdSub) {
      setStdSubState(allStdSub);
    }
    const allTeachers = await getAllTeachers();
    if (allTeachers) {
      setTeachers(allTeachers);
    }
    console.log(allStdSub);
  }

  async function handleAddStandard() {
    const success = await addStandard(addStdText);
    if (success) {
      setAddStdText("");
      setUp();
    }
  }

  async function handeUpdateStandardName(standardId: string) {
    await updateStandardName(standardId, editStdName);
    setIsEditStdName(false);
    setUp();
  }

  async function handleDeleteStandard(standardId: string) {
    await deleteStandard(standardId);
    setUp();
  }

  async function handleAddStandardSubjects(standardId: string, subjects: string) {
    const newSubjects = subjects.split(",").map((name: string) => ({ name }));
    await addSubjectsInStandard(standardId, newSubjects);
    setAddSubjTexts((prev: any) => ({ ...prev, [standardId]: "" }));
    setUp();
  }

  async function handleDeleteSubject(standardId: string, subjectName: string) {
    await removeSubjectFromStandard(standardId, subjectName);
    setUp();
  }

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto", p: 4 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Manage Standards and Subjects
      </Typography>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Add a New Standard
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <TextField
            size="small"
              fullWidth
              variant="outlined"
              placeholder="Enter standard name"
              value={addStdText}
              onChange={(e) => setAddStdText(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                handleAddStandard();
              }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {stdSubState.map((standard: any) => (
          <Grid item xs={12} md={6} key={standard.id}>
            <Card>
              <CardContent>
                {isEditStdName && standard.id === editStdId ? (
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      value={editStdName}
                      onChange={(e) => setEditStdName(e.target.value)}
                    />
                    
                    <Box ml={2} display='flex'>
                      <IconButton onClick={() => handeUpdateStandardName(standard.id)}>
                        <Save color="success" />
                      </IconButton>
                      <IconButton onClick={() => setIsEditStdName(false)}>
                        <Cancel color="error" />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{standard.standard}</Typography>
                    
                    <Box ml={2} >
                      <IconButton onClick={() => {
                        setIsEditStdName(true);
                        setEditStdName(standard.standard);
                        setEditStdId(standard.id);
                      }}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteStandard(standard.id)}>
                        <Delete color="error" />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                <Box mt={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Add subjects (comma-separated)"
                    value={addSubjTexts[standard.id] || ""}
                    onChange={(e) => setAddSubjTexts((prev: any) => ({ ...prev, [standard.id]: e.target.value }))}
                  />
                  <Button
                    sx={{ mt: 1 }}
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddStandardSubjects(standard.id, addSubjTexts[standard.id])}
                  >
                    Add Subjects
                  </Button>
                </Box>
                <Box marginTop={'10px'}>
                  <Typography className="">
                    <span className="">
                   
                    ClassTeacher - {standard.classTeacherId ? 
                    <span className="text-blue-500 font-semibold">

                   { teachers.find((teacher: any) => teacher.id === standard.classTeacherId)?.name}
                    </span>
                    : 
                    
                    <span className="text-red-500 font-semibold">
                    Not Assigned
                    </span>
                    
                    }
                    </span>
                  </Typography>
                </Box>
    

                <Box mt={2}>
                  {standard.subjects.map((subject: any) => (
                    <Box key={subject.name} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography>
                        {subject.name} - {" "}
                        {subject.teacherIds?.length != 0 ? subject.teacherIds?.map((id: string) => (
                          <span key={id} className="text-blue-500 font-semibold">
                            {teachers.find((teacher: any) => teacher.id === id)?.name},{" "}
                          </span>
                        )) : <span className="text-red-500 font-semibold">Not Assigned</span>}
                      </Typography>
                      <IconButton size="small" onClick={() => handleDeleteSubject(standard.id, subject.name)}>
                        <Delete  color="error" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TestSubjectStdPage;
