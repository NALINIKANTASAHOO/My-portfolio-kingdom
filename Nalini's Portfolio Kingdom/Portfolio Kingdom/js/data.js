/* =========================================================
   PORTFOLIO DATA
   Edit this file to update the content shown in each shop —
   nothing else in the project needs to change.
========================================================= */

const PROFILE = {
  name: "Nalini Kanta Sahoo",
  title: "Electronics & Telecommunication Engineer · IoT & AI Enthusiast",
  location: "Odisha, India",
  email: "nalini20121136@gmail.com",
  linkedin: "https://www.linkedin.com/in/nalinikanta-sahoo-138a3337b/",
  github: "https://github.com/NALINIKANTASAHOO",
  site: "https://nalini-kanta-sahoo-portfolio-q4he.vercel.app/",
  summary: "Motivated Electronics and Telecommunication Engineering undergraduate with a strong interest in embedded systems, IoT, artificial intelligence, data science, and full-stack web development. Passionate about solving real-world problems through technology, building end-to-end projects, and continuously learning modern tools and frameworks.",
  education: {
    degree: "Bachelor of Technology (B.Tech) — Electronics and Telecommunication Engineering",
    school: "Veer Surendra Sai University of Technology (VSSUT), Burla"
  },
  achievements: [
    "Built multiple hands-on technical projects spanning hardware and software",
    "Active learner in embedded systems and IoT",
    "Continuously improving DSA and problem-solving skills",
    "Maintains a professional, actively updated GitHub portfolio"
  ],
  softSkills: ["Problem Solving","Teamwork","Communication","Time Management","Adaptability","Leadership","Continuous Learning"],
  languages: ["English","Hindi","Odia"]
};

const SKILLS = {
  "Programming": ["C","Python","JavaScript"],
  "Web Technologies": ["HTML5","CSS3","JavaScript"],
  "Tools": ["Git","GitHub","VS Code","Arduino IDE","KiCad"],
  "Domains": ["Embedded Systems","Internet of Things (IoT)","Data Structures & Algorithms","Artificial Intelligence","Data Science"],
  "Database": ["SQL (Basic)"]
};

const PROJECTS = [
  {"id":1,"title":"Accident Detection and Alert System","category":"Embedded","description":"An Arduino-based embedded system that detects accidents using a tilt sensor and triggers visual and audio alerts for rapid emergency response.","link":"https://github.com/NALINIKANTASAHOO/THINKERCAD-PROJECTS"},
  {"id":2,"title":"LLM Study Buddy","category":"AI","description":"A privacy-first study tool that summarizes lecture PDFs and generates practice questions using a locally-run LLM (Ollama) — no data ever leaves the user's device.","link":"https://github.com/NALINIKANTASAHOO/OLLAMA-LOCAL-AI-PROJECTS"},
  {"id":3,"title":"30 Basic Web Development Projects","category":"Web Development","description":"A collection of 30 web development projects built using HTML, CSS, and JavaScript as part of my learning journey — strengthening core web development concepts through hands-on practice.","link":"https://github.com/NALINIKANTASAHOO/Web-development-projects"}
];

const CERTIFICATES = [
  {"title":"IoT Security Analyst","issuer":"MSDE Skill India","issueDate":"4 July 2026","description":"Foundational understanding of securing IoT ecosystems — architecture, threat identification, device & network security, authentication, and risk assessment.","credentialURL":"https://api-fe.skillindiadigital.gov.in/api/registry-course/getCertificatePresignedUrl/2026070491976246-4312dede-af39-46d7-a055-2bc5047aba3a"},
  {"title":"Intro to Programming with Python","issuer":"Kaggle","issueDate":"4 July 2026","description":"Strengthened programming fundamentals — variables, conditionals, loops, functions, and problem-solving techniques.","credentialURL":"https://www.kaggle.com/learn/certification/nalinisahoo2026/intro-to-programming"},
  {"title":"Google AI Essentials Specialization","issuer":"Google (Coursera)","issueDate":"May 2026","description":"Comprehensive understanding of AI concepts including machine learning, deep learning, and neural networks, applied to real-world problems.","credentialURL":"https://www.coursera.org/account/accomplishments/specialization/UVNG1ORJ1V7B"},
  {"title":"Microsoft Excel: Mastering Data Analysis with Pivot Tables","issuer":"Udemy","issueDate":"May 2026","description":"Mastered Excel fundamentals including data analysis and pivot tables for effective data manipulation and visualization.","credentialURL":"https://www.udemy.com/certificate/UC-4787a394-1d09-4498-9d2c-7e4027157613/"},
  {"title":"Google Prompting Essentials","issuer":"Google (Coursera)","issueDate":"May 2026","description":"Fundamentals of effective prompting for AI systems to harness AI more efficiently.","credentialURL":"https://coursera.org/share/2ff99c6b6f4faa3096158fa59e5bcc7e"},
  {"title":"TCS iON Career Edge — Young Professional","issuer":"TCS iON","issueDate":"2026","description":"Solid foundation in IT service management and skills to manage and improve IT services effectively.","credentialURL":"https://www.tcsion.com/careeredge/certificate/2026/"}
];

/* Shops around the town, each mapped to a portfolio section.
   `angle` places the shop around the ring road (degrees). */
const SHOPS = [
  {key:"about",       name:"About Me Café",       icon:"☕", color:0xff8a5b, roof:0xd9603a, angle:0},
  {key:"skills",      name:"Skills Workshop",     icon:"🛠️", color:0x4dabf7, roof:0x2b7fc1, angle:60},
  {key:"projects",    name:"Projects Arcade",     icon:"🕹️", color:0x9775fa, roof:0x6741c9, angle:120},
  {key:"certificates",name:"Certificates Hall",   icon:"🏅", color:0xffd43b, roof:0xe0a800, angle:180},
  {key:"education",   name:"Education Library",   icon:"📚", color:0x38d9a9, roof:0x0ca678, angle:240},
  {key:"contact",     name:"Contact Post Office", icon:"✉️", color:0xf783ac, roof:0xc2255c, angle:300},
];
