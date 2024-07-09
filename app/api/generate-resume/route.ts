export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import axios from 'axios';
import { load } from 'cheerio';


const model = new OpenAI({ 
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.6,
  modelName: "gpt-4o",
  maxTokens: 2500,
});

const latexTemplate = `
\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
\\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item[\\tiny\\textbullet]\\small{
    {{#1 \\vspace{-2pt}}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item[]  % Add empty square brackets here
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
  \\item[]  % Add empty square brackets here
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.35in, label={}]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge [Full Name]} \\\\
    [Address] \\\\
    [Phone Number] • [Email Address]
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
    [Education Content] 


%-----------EXPERIENCE-----------
\\section{Professional Experience}
    [Experience Content]

%-----------PROJECTS-----------
\\section{Projects}
    [Projects Content]

%-----------SKILLS-----------
\\section{Technical Skills}
    [Skills Content]

\\end{document}
`;

const resumePrompt = `
You are an AI resume optimizer with one primary goal: create a resume that maximizes ATS score by directly including a high density of keywords from the job description. Follow these strict rules:

1. Analyze the job description. Extract EVERY skill, qualification, technology, keyword, and phrase. Create a list of these keywords, ordered by importance and frequency.

2. Completely rewrite the resume. Your main objective is to include as many keywords as possible from the job description, verbatim.

3. For EACH section of the resume:
   a. Include AT LEAST 5-7 exact keywords or phrases from the job description.
   b. Ensure that at least 50% of the text in each section consists of direct quotes or keywords from the job description.
   c. Rewrite experiences to directly incorporate these keywords, even if it means significantly altering the original content.

4. Create a "Key Skills" or "Core Competencies" section at the top of the resume. This section should be a dense list of 15-20 key skills/technologies mentioned in the job description, using the exact phrasing.

5. In the experience section:
   a. Begin each bullet point with a relevant keyword or phrase from the job description.
   b. Ensure each job listed includes at least 10 keywords from the job description.
   c. If a required skill/experience is missing, creatively reinterpret past experiences to include it.

6. Add a "Technical Proficiencies" section if not already present. List ALL technical skills mentioned in the job description, even if not in the original resume.

7. In the education section, add relevant coursework or projects that allow you to include more keywords from the job description.

8. Ensure ATS-friendliness:
   a. Use standard section headings that include keywords from the job description.
   b. Use a simple, keyword-rich layout.

9. In your response:
   a. First half: ONLY the LaTeX code for the keyword-rich resume.
   b. Second half: Start with "description:" followed by:
      - A list of ALL keywords and phrases you identified from the job description.
      - The exact count of how many times each keyword appears in the resume.
      - An explanation of how you maximized keyword density in each section.

10.Keep the resume under one page unless the job explicitly requires more extensive experience.

Job Description:
{jobDescription}

User's Past Jobs and Experiences:
{resumeData}

Generate the content for each section of the LaTeX resume. Replace the [Content] placeholders with your generated content:

{latexTemplate}

Your ONLY objective is to create a resume with the highest possible keyword match rate for ATS screening. Be EXTREMELY aggressive in incorporating EVERY relevant keyword and phrase, aiming for at least 80% of the identified keywords to appear in the resume, many of them multiple times.
`;

const promptTemplate = new PromptTemplate({
  template: resumePrompt,
  inputVariables: ["jobDescription", "resumeData", "latexTemplate"],
});

const chain = new LLMChain({ llm: model, prompt: promptTemplate });

async function generateResume(jobDescription: string, resumeData: any) {
  const result = await chain.call({
    jobDescription: jobDescription,
    resumeData: JSON.stringify(resumeData),
    latexTemplate: latexTemplate,
  }); 
  // Remove the ```latex at the start and ``` at the end
  return result.text.replace(/^```latex\n/, '').replace(/\n```$/, '');
  
}

async function extractJobDescription(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 300;
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const $ = load(response.data);

    if (url.toLowerCase().includes('workday')) {
      const jobDescription = $('script[type="application/ld+json"]').html();
      if (jobDescription) {
        const parsedDescription = JSON.parse(jobDescription);
        return parsedDescription.description || '';
      }

      const descriptionElement = $('.job-description');
      if (descriptionElement.length > 0) {
        return descriptionElement.text().trim();
      }
    } else if (url.toLowerCase().includes('greenhouse')) {
      const contentDiv = $('#content');
      const elements = contentDiv.find('p, ul');
      let jobDescription = '';

      elements.each((index, element) => {
        if (element.tagName === 'ul') {
          $(element).find('li').each((i, li) => {
            jobDescription += `• ${$(li).text().trim()}\n`;
          });
        } else {
          jobDescription += `${$(element).text().trim()}\n\n`;
        }
      });

      return jobDescription
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .join('\n');
    } else if (url.toLowerCase().includes('lever.co')) {
      const jobTitle = $('.posting-headline h2').text().trim();
      const location = $('.posting-categories .location').text().trim();
      const department = $('.posting-categories .department').text().trim();
      const workplaceType = $('.posting-categories .workplaceTypes').text().trim();
      const jobDescription = $('.section[data-qa="job-description"]').text().trim();
      const responsibilities = $('.section:contains("Responsibilities") ul').text().trim();
      const qualifications = $('.section:contains("Qualifications") ul').text().trim();
      const salaryRange = $('.section[data-qa="salary-range"]').text().trim();
      const closingDescription = $('.section[data-qa="closing-description"]').text().trim();

      return `
        Job Title: ${jobTitle}
        Location: ${location}
        Department: ${department}
        Workplace Type: ${workplaceType}

        Job Description:
        ${jobDescription}

        Responsibilities:
        ${responsibilities}

        Qualifications:
        ${qualifications}

        Salary Range:
        ${salaryRange}

        Additional Information:
        ${closingDescription}
      `.trim();
    }

    return '';
  } catch (error) {
    console.error('Error fetching job description:', error);
    return '';
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  let { jobDescription, resumeData } = body;

  if (!jobDescription || !resumeData) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Check if jobDescription is a URL
  if (jobDescription.startsWith('http')) {
    const extractedDescription = await extractJobDescription(jobDescription);
    if (extractedDescription) {
      jobDescription = extractedDescription;
      console.log(jobDescription);
    } else {
      return NextResponse.json({ error: 'Failed to extract job description from URL' }, { status: 400 });
    }
  }

  try {
    const latex = await generateResume(jobDescription, resumeData);

    return new NextResponse(latex, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 });
  }
}