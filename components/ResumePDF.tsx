'use client'

import React, { useRef } from 'react';
import { usePDF } from 'react-to-pdf';

const ResumePDF = () => {
  const { toPDF, targetRef } = usePDF({filename: 'resume.pdf'});

  const resumeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume</title>
        <style>
            @page {
                size: letter;
                margin: 0;
            }
            body {
                font-family: "Times New Roman", Times, serif;
                line-height: 1.2;
                color: #333;
                width: 8.5in;
                height: 11in;
                margin: 0 auto; /* Center the content */
                padding: 0.5in; /* Add padding here */
                box-sizing: border-box;
                font-size: 10pt;
            }
            .header {
                text-align: center;
                margin-bottom: 10px;
            }
            h1 {
                margin: 0;
                font-size: 18pt;
            }
            h2 {
                font-size: 12pt;
                border-bottom: 1.5px solid #333;
                padding-bottom: 3px;
                margin: 10px 0 5px;
                font-weight: normal;
            }
            .section {
                margin-bottom: 10px;
            }
            .job, .project, .education {
                margin-bottom: 8px;
            }
            .job-header, .job-subheader {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
            }
            .job-company, .university {
                font-weight: bold;
                font-size: 11pt;
            }
            .job-title, .degree {
                font-style: italic;
                font-size: 11pt;
            }
            ul {
                margin: 2px 0;
                padding-left: 20px;
            }
            li {
                margin-bottom: 1px;
            }
            .skills-list {
                list-style-type: none;
                padding-left: 0;
                margin: 5px 0;
            }
            .skills-list li {
                margin-bottom: 3px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>[User's Name]</h1>
            <p>[User's Address] | [User's Phone Number] | [User's Email]</p>
        </div>

        <div class="section">
            <h2>EDUCATION</h2>
            <div class="education">
                <div class="education-header">
                    <span class="university">University of Technology</span>
                    <span class="education-years">Jan. 2014 - May 2018</span>
                </div>
                <div class="degree">Bachelor of Science in Computer Science</div>
            </div>
            <div class="education">
                <div class="education-header">
                    <span class="university">Community College</span>
                    <span class="education-years">Sep. 2011 - Dec. 2013</span>
                </div>
                <div class="degree">Associate's in Computer Programming</div>
            </div>
        </div>  

        <div class="section">
            <h2>EXPERIENCE</h2>
            <div class="job">
                <div class="job-header">
                    <span class="job-company">Google</span>
                    <span class="job-location">Remote</span>
                </div>
                <div class="job-subheader">
                    <span class="job-title">Senior Developer</span>
                    <span class="job-years">Feb 2022 - Feb 2023</span>
                </div>
                <ul>
                    <li>Lead the development of a full-stack web application using React, Node.js, and PostgreSQL</li>
                </ul>
            </div>
            <div class="job">
                <div class="job-header">
                    <span class="job-company">Microsoft</span>
                    <span class="job-location">San Francisco, CA</span>
                </div>
                <div class="job-subheader">
                    <span class="job-title">Software Engineer</span>
                    <span class="job-years">Feb 2019 - Feb 2022</span>
                </div>
                <ul>
                    <li>Developed and maintained web applications using React and Node.js</li>
                    <li>Implemented RESTful APIs and worked with MongoDB</li>
                    <li>Learned how to use Git and GitHub and worked with Agile methodologies</li>
                </ul>
            </div>
            <div class="job">
                <div class="job-header">
                    <span class="job-company">Amazon</span>
                    <span class="job-location">San Francisco, CA</span>
                </div>
                <div class="job-subheader">
                    <span class="job-title">Software Engineer</span>
                    <span class="job-years">Feb 2020 - Feb 2022</span>
                </div>
                <ul>
                    <li>Developed web applications using React and Node.js</li>
                    <li>Implemented RESTful APIs and worked with MongoDB</li>
                    <li>Learned how to use Git and GitHub and worked with Agile methodologies</li>
                </ul>
            </div>
            <div class="job">
                <div class="job-header">
                    <span class="job-company">StartupX</span>
                    <span class="job-location">Palo Alto, CA</span>
                </div>
                <div class="job-subheader">
                    <span class="job-title">Junior Developer</span>
                    <span class="job-years">2018 - 2019</span>
                </div>
                <ul>
                    <li>Assisted in front-end development using HTML, CSS, and JavaScript</li>
                    <li>Worked with Node.js and PostgreSQL to develop RESTful APIs</li>
                    <li>Learned how to use Git and GitHub and worked with Agile methodologies</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>PROJECTS</h2>
            <div class="project">
                <span class="project-name">Task Management App</span> -
                <span class="project-details">React, Node.js, PostgreSQL</span>
                <ul>
                    <li>Developed a full-stack web application for task management</li>
                </ul>
            </div>
            <div class="project">
                <span class="project-name">Task App</span> -
                <span class="project-details">Next.js, Node.js, MongoDB</span>
                <ul>
                    <li>Developed a full-stack web application for management of weight</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>SKILLS</h2>
            <ul class="skills-list">
                <li><strong>Programming:</strong> JavaScript, HTML, CSS</li>
                <li><strong>Frameworks:</strong> React, Next.js, Node.js</li>
                <li><strong>Databases:</strong> PostgreSQL, MongoDB</li>
                <li><strong>Tools:</strong> Git, GitHub</li>
                <li><strong>Other:</strong> Agile methodologies, RESTful API development, Database design</li>
            </ul>
        </div>
    </body>
    </html>
  `;

  return (
    <div style={{ width: '8.5in', margin: '0 auto' }}>
      <div 
        ref={targetRef} 
        dangerouslySetInnerHTML={{ __html: resumeHtml }} 
        style={{ width: '100%', height: '11in' }}
      />
      <button onClick={() => toPDF()}>Download PDF</button>
    </div>
  );
};

export default ResumePDF;