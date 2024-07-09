'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  ThemeProvider, createTheme, CssBaseline,
  Stepper, Step, StepLabel, Button, TextField, Card, CardContent, CardHeader, 
  IconButton, Chip, Grid, Typography, Container, Box, useMediaQuery
} from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Link from 'next/link';

// Define types
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface WorkExperience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

interface Skills {
  soft: string[];
  hard: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
}

interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skills;
  projects: Project[];
}

const initialResumeData: ResumeData = {
  personalInfo: { fullName: '', email: '', phone: '', address: '' },
  education: [],
  workExperience: [],
  skills: { soft: [], hard: [] },
  projects: []
};

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6200EA',
    },
    secondary: {
      main: '#00C853',
    },
    background: {
      default: '#f0f0f0',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const AnimatedCard = motion(Card);

// Custom hook for local storage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// Memoized form components
const PersonalInfoForm = React.memo(({ data, updateData }: { data: PersonalInfo, updateData: (data: PersonalInfo) => void }) => {
  const handleChange = (field: keyof PersonalInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ ...data, [field]: e.target.value });
  };

  return (
    <Card>
      <CardHeader title="Personal Information" />
      <CardContent>
        <TextField
          fullWidth
          label="Full Name"
          value={data.fullName}
          onChange={handleChange('fullName')}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={data.email}
          onChange={handleChange('email')}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Phone"
          value={data.phone}
          onChange={handleChange('phone')}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Address"
          value={data.address}
          onChange={handleChange('address')}
          margin="normal"
          multiline
          rows={3}
        />
      </CardContent>
    </Card>
  );
});

const EducationForm = React.memo(({ data, updateData }: { data: Education[], updateData: (data: Education[]) => void }) => {
  const handleEducationChange = (index: number, field: keyof Education) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEducation = [...data];
    newEducation[index] = { ...newEducation[index], [field]: e.target.value };
    updateData(newEducation);
  };

  return (
    <Card>
      <CardHeader title="Education" />
      <CardContent>
        <DragDropContext onDragEnd={(result) => {
          if (!result.destination) return;
          const items = Array.from(data);
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reorderedItem);
          updateData(items);
        }}>
          <Droppable droppableId="education">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {data.map((edu, index) => (
                  <Draggable key={index} draggableId={`edu-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ marginBottom: '1rem', ...provided.draggableProps.style }}
                      >
                        <TextField
                          fullWidth
                          label="Degree"
                          value={edu.degree}
                          onChange={handleEducationChange(index, 'degree')}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label="Institution"
                          value={edu.institution}
                          onChange={handleEducationChange(index, 'institution')}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label="Location"
                          value={edu.location}
                          onChange={handleEducationChange(index, 'location')}
                          margin="normal"
                        />
                        <TextField
                          label="Start Date"
                          type="date"
                          value={edu.startDate}
                          onChange={handleEducationChange(index, 'startDate')}
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="End Date"
                          type="date"
                          value={edu.endDate}
                          onChange={handleEducationChange(index, 'endDate')}
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                        />
                        <IconButton onClick={() => {
                          const newEducation = data.filter((_, i) => i !== index);
                          updateData(newEducation);
                        }}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button startIcon={<AddIcon />} onClick={() => {
          const newEducation = [...data, { degree: '', institution: '', location: '', startDate: '', endDate: '' }];
          updateData(newEducation);
        }}>
          Add Education
        </Button>
      </CardContent>
    </Card>
  );
});

const WorkExperienceForm = React.memo(({ data, updateData }: { data: WorkExperience[], updateData: (data: WorkExperience[]) => void }) => {
  const handleWorkExperienceChange = (index: number, field: keyof WorkExperience) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWorkExperience = [...data];
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: field === 'responsibilities' ? e.target.value.split('\n') : e.target.value };
    updateData(newWorkExperience);
  };

  return (
    <Card>
      <CardHeader title="Work Experience" />
      <CardContent>
        <DragDropContext onDragEnd={(result) => {
          if (!result.destination) return;
          const items = Array.from(data);
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reorderedItem);
          updateData(items);
        }}>
          <Droppable droppableId="workExperience">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {data.map((exp, index) => (
                  <Draggable key={index} draggableId={`exp-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ marginBottom: '1rem', ...provided.draggableProps.style }}
                      >
                        <TextField
                          fullWidth
                          label="Job Title"
                          value={exp.title}
                          onChange={handleWorkExperienceChange(index, 'title')}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label="Company"
                          value={exp.company}
                          onChange={handleWorkExperienceChange(index, 'company')}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label="Location"
                          value={exp.location}
                          onChange={handleWorkExperienceChange(index, 'location')}
                          margin="normal"
                        />
                        <TextField
                          label="Start Date"
                          type="date"
                          value={exp.startDate}
                          onChange={handleWorkExperienceChange(index, 'startDate')}
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          label="End Date"
                          type="date"
                          value={exp.endDate}
                          onChange={handleWorkExperienceChange(index, 'endDate')}
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          fullWidth
                          label="Responsibilities"
                          value={exp.responsibilities.join('\n')}
                          onChange={handleWorkExperienceChange(index, 'responsibilities')}
                          margin="normal"
                          multiline
                          rows={4}
                        />
                        <IconButton onClick={() => {
                          const newWorkExperience = data.filter((_, i) => i !== index);
                          updateData(newWorkExperience);
                        }}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button startIcon={<AddIcon />} onClick={() => {
          const newWorkExperience = [...data, { title: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [] }];
          updateData(newWorkExperience);
        }}>
          Add Work Experience
        </Button>
      </CardContent>
    </Card>
  );
});

const SkillsForm = React.memo(({ data, updateData }: { data: Skills, updateData: (data: Skills) => void }) => {
  const [newSkill, setNewSkill] = useState({ soft: '', hard: '' });

  const addSkill = (type: 'soft' | 'hard') => {
    if (newSkill[type]) {
      const updatedSkills = {
        ...data,
        [type]: [...(data[type] || []), newSkill[type]]
      };
      updateData(updatedSkills);
      setNewSkill({ ...newSkill, [type]: '' });
    }
  };

  const removeSkill = (type: 'soft' | 'hard', index: number) => {
    const updatedSkills = { ...data };
    updatedSkills[type] = updatedSkills[type].filter((_, i) => i !== index);
    updateData(updatedSkills);
  };

  return (
    <Card>
      <CardHeader title="Skills" />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Soft Skills
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {(data.soft || []).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => removeSkill('soft', index)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <TextField
                fullWidth
                label="Add Soft Skill"
                value={newSkill.soft}
                onChange={(e) => setNewSkill({ ...newSkill, soft: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addSkill('soft')}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => addSkill('soft')}
                style={{ minWidth: '80px' }}
              >
                Add
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Hard Skills
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {(data.hard || []).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => removeSkill('hard', index)}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <TextField
                fullWidth
                label="Add Hard Skill"
                value={newSkill.hard}
                onChange={(e) => setNewSkill({ ...newSkill, hard: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addSkill('hard')}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => addSkill('hard')}
                style={{ minWidth: '80px' }}
              >
                Add
              </Button>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

const ProjectsForm = React.memo(({ data, updateData }: { data: Project[], updateData: (data: Project[]) => void }) => {
  const handleProjectChange = (index: number, field: keyof Project) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProjects = [...data];
    newProjects[index] = { ...newProjects[index], [field]: field === 'technologies' ? e.target.value.split(',').map(tech => tech.trim()) : e.target.value };
    updateData(newProjects);
  };

  return (
    <Card>
      <CardHeader title="Projects" />
      <CardContent>
        <DragDropContext onDragEnd={(result) => {
          if (!result.destination) return;
          const items = Array.from(data);
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reorderedItem);
          updateData(items);
        }}>
          <Droppable droppableId="projects">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {data.map((project, index) => (
                  <Draggable key={index} draggableId={`project-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ marginBottom: '1rem', ...provided.draggableProps.style }}
                      >
                        <TextField
                          fullWidth
                          label="Project Name"
                          value={project.name}
                          onChange={handleProjectChange(index, 'name')}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label="Description"
                          value={project.description}
                          onChange={handleProjectChange(index, 'description')}
                          margin="normal"
                          multiline
                          rows={3}
                        />
                        <TextField
                          fullWidth
                          label="Technologies (comma-separated)"
                          value={project.technologies.join(', ')}
                          onChange={handleProjectChange(index, 'technologies')}
                          margin="normal"
                        />
                        <IconButton onClick={() => {
                          const newProjects = data.filter((_, i) => i !== index);
                          updateData(newProjects);
                        }}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button startIcon={<AddIcon />} onClick={() => {
          const newProjects = [...data, { name: '', description: '', technologies: [] }];
          updateData(newProjects);
        }}>
          Add Project
        </Button>
      </CardContent>
    </Card>
  );
});

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useLocalStorage<ResumeData>('resumeData', initialResumeData);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Personal Info', 'Education', 'Work Experience', 'Skills', 'Projects'];

  const handleNext = useCallback(() => setActiveStep((prevActiveStep) => prevActiveStep + 1), []);
  const handleBack = useCallback(() => setActiveStep((prevActiveStep) => prevActiveStep - 1), []);
  const handleStepChange = useCallback((step: number) => setActiveStep(step), []);

  const updateResumeData = useCallback((section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({ ...prev, [section]: data }));
  }, [setResumeData]);

  const renderStepContent = useCallback((step: number) => {
    switch (step) {
      case 0: return <PersonalInfoForm data={resumeData.personalInfo} updateData={(data: PersonalInfo) => updateResumeData('personalInfo', data)} />;
      case 1: return <EducationForm data={resumeData.education} updateData={(data: Education[]) => updateResumeData('education', data)} />;
      case 2: return <WorkExperienceForm data={resumeData.workExperience} updateData={(data: WorkExperience[]) => updateResumeData('workExperience', data)} />;
      case 3: return <SkillsForm data={resumeData.skills} updateData={(data: Skills) => updateResumeData('skills', data)} />;
      case 4: return <ProjectsForm data={resumeData.projects} updateData={(data: Project[]) => updateResumeData('projects', data)} />;
      default: return null;
    }
  }, [resumeData, updateResumeData]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <GradientText variant="h2"  sx={{ fontWeight: 700, mb: 2 }}>
          AI-Powered Resume Maker
          </GradientText>
          <Typography variant="h5" color="textSecondary" sx={{ mb: 4 }}>
            Prepare your resume details for an out-of-this-world job application!
          </Typography>
          <Link href="/" passHref>
            <Button variant="contained" color="primary" startIcon={<RocketLaunchIcon />} size="large">
              Launch Resume Generator
            </Button>
          </Link>
        </Box>
        <AnimatedCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardContent>
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel
              sx={{ 
                mb: 4,
                [theme.breakpoints.down('sm')]: {
                  '& .MuiStep-root': {
                    flex: 1,
                    padding: '0 4px',
                  },
                  '& .MuiStepLabel-root': {
                    flexDirection: 'column',
                    alignItems: 'center',
                  },
                  '& .MuiStepLabel-label': {
                    mt: 1,
                    fontSize: '0.75rem',
                  },
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={label} onClick={() => handleStepChange(index)}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent(activeStep)}
              </motion.div>
            </AnimatePresence>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                onClick={handleBack} 
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                onClick={handleNext} 
                disabled={activeStep === steps.length - 1}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </CardContent>
        </AnimatedCard>
      </Container>
    </ThemeProvider>
  );
}