import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { teastsAtom } from '../../state/testsAtom';
import { stdSubAtom } from '../../state/stdSubAtom';
import { studentsAtom } from '../../state/studentsAtom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { userAtom } from '../../state/userAtom';
import { UserRole } from '../../types/type';

const ManageTest = () => {
  const tests = useRecoilValue(teastsAtom);
  const stdSub = useRecoilValue(stdSubAtom);
  const students = useRecoilValue(studentsAtom);
  const user = useRecoilValue(userAtom);

  const [selectedStd, setSelectedStd] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user?.role === UserRole.Teacher && stdSub.length > 0) {
      const stdid = stdSub.find((s: any) => s.classTeacherId === user.id);
      setSelectedStd(stdid.id);
    }
  }, []);


  const handleStdChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedStd(event.target.value as string);
  };

  const openModal = (test: any) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTest(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Standards
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="standard-select-label">Select Standard</InputLabel>
              <Select
                labelId="standard-select-label"
                value={selectedStd}
                label="Select Standard"
                onChange={(event) => handleStdChange(event as React.ChangeEvent<{ value: unknown }>)}
              >
                <MenuItem value="">
                  <em>All Standards</em>
                </MenuItem>
                {stdSub.map((std: any) => (
                  <MenuItem key={std.id} value={std.id}>
                    {std.standard}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Tests
            </Typography>
            {selectedStd ? (
              <List>
                {tests
                  .filter((t: any) => t.standardId === selectedStd)
                  .map((t: any) => (
                    <ListItem
                      key={t.id}
                      onClick={() => openModal(t)}
                      sx={{
                        mb: 1,
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'grey.100',
                        },
                      }}
                      component="li"
                    >
                      <ListItemText
                        primary={`${t.name} - ${t.subject}`}
                        secondary={`Date: ${new Date(t.takenDate).toLocaleDateString()} | Total Marks: ${t.totalMarks}`}
                      />
                    </ListItem>
                  ))}
                {tests.filter((t: any) => t.standardId === selectedStd).length === 0 && (
                  <Typography variant="body2" color="textSecondary">
                    No tests available for the selected standard.
                  </Typography>
                )}
              </List>
            ) : (
              <Typography variant="body1" color="textSecondary">
                Please select a standard to view tests.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Test Details Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        {selectedTest && (
          <>
            <DialogTitle>{selectedTest.name}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle1" gutterBottom>
                Subject: {selectedTest.subject}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Date: {new Date(selectedTest.takenDate).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Total Marks: {selectedTest.totalMarks}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Students</Typography>
                <List>
                  {selectedTest.students.map((student: any) => {
                    const studentInfo = students.find((s: any) => s.id === student.studentId);
                    return (
                      <ListItem key={student.studentId} sx={{ pl: 0 }}>
                        <ListItemText
                          primary={studentInfo ? studentInfo.name : 'Unknown Student'}
                          secondary={`Marks: ${student.marks} / ${selectedTest.totalMarks}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal} variant="contained" color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ManageTest;
