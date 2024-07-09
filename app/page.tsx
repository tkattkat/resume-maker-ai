"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ThemeProvider, createTheme, CssBaseline,
  Card, CardContent, Typography, TextField, Button, Box, Container, Grid
} from '@mui/material';
import { styled } from '@mui/system';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SettingsIcon from '@mui/icons-material/Settings';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface ResumeData {
  personalInfo: { fullName: string; email: string; phone: string; address: string };
  education: any[];
  workExperience: any[];
  softSkills: string[];
  hardSkills: string[];
  projects: any[];
}

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

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [latexContent, setLatexContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    const storedResumeData = localStorage.getItem('resumeData'); 
    if (storedResumeData) {
      setResumeData(JSON.parse(storedResumeData));
    }
  }, []);

  const generateResume = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription, resumeData }),
      });

      if (response.ok) {
        const latex = await response.text();
        setLatexContent(latex);
      } else {
        console.error("Failed to generate resume");
      }
    } catch (error) {
      console.error("Error generating resume:", error);
    }
    setIsLoading(false);
  };

  const openInOverleaf = () => {
    if (!latexContent) return;
    
    const utf8Encoder = new TextEncoder();
    const utf8Bytes = utf8Encoder.encode(latexContent);
    const base64Content = btoa(String.fromCharCode.apply(null, Array.from(utf8Bytes)));

    const form = document.createElement('form');
    form.method = 'post';
    form.action = 'https://www.overleaf.com/docs';
    form.target = '_blank';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'snip_uri';
    input.value = `data:application/x-tex;base64,${base64Content}`;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <GradientText variant="h2"  sx={{ fontWeight: 700, mb: 2 }}>
            AI-Powered Resume Maker
          </GradientText>
          <Typography variant="h5" color="textSecondary" sx={{ mb: 4 }}>
            Speed up your career with our AI-powered resume generator!
          </Typography>
          <Link href="/settings" passHref>
            <Button variant="outlined" color="primary" startIcon={<SettingsIcon />} size="large">
              Customize Your Resume
            </Button>
          </Link>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <AnimatedCard
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Job Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Enter job description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={generateResume}
                  disabled={isLoading || !resumeData}
                  startIcon={<RocketLaunchIcon />}
                  size="large"
                >
                  {isLoading ? "Generating..." : "Generate Your Resume"}
                </Button>
                {!resumeData && (
                  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    Please prepare your resume settings first!
                  </Typography>
                )}
              </CardContent>
            </AnimatedCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <AnimatedCard
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Your Resume
                </Typography>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={latexContent ? 'content' : 'placeholder'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {latexContent ? (
                      <TextField
                        fullWidth
                        multiline
                        rows={10}
                        variant="outlined"
                        value={latexContent}
                        InputProps={{ readOnly: true }}
                        sx={{ fontFamily: 'monospace', fontSize: '0.875rem', mb: 2 }}
                      />
                    ) : (
                      <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed', borderColor: 'grey.400', borderRadius: 2 }}>
                        <Typography variant="body1" color="textSecondary">
                          Your resume will appear here in LaTeX format
                        </Typography>
                      </Box>
                    )}
                  </motion.div>
                </AnimatePresence>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={openInOverleaf}
                  disabled={!latexContent}
                  startIcon={<OpenInNewIcon />}
                  size="large"
                >
                  Open in Overleaf 
                </Button>
              </CardContent>
            </AnimatedCard>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}