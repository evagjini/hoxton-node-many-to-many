import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const db = Database("./db/data.db", { verbose: console.log });
const app = express();
app.use(cors());
app.use(express.json());

const port = 5556;

//  Applicants

const getAllApplicants = db.prepare(`
SELECT * FROM applicants `);

const getApplicantById = db.prepare(`
SELECT * FROM applicants WHERE id = @id`);

const getInterviewersForApplicant = db.prepare(`
SELECT interviewers.* FROM interviewers
JOIN interviews ON  interviewers.id = interviews.interviewersId
WHERE interviews.applicantsId = @applicantsId `);

const getInterviewsForApplicant = db.prepare(`
SELECT * FROM interviews WHERE applicantsId = @applicantsId`);

const createNewApplicant = db.prepare(`
INSERT INTO applicants (name, email,position) VALUES (@name, @email,@position)`);

// Interviewers
const getAllInterviewers = db.prepare(`
  SELECT * FROM interviewers`);

const getInterviewerById = db.prepare(`
  SELECT * FROM interviewers WHERE id = @id
  `);

const getApplicantsForInterviewer = db.prepare(`
  SELECT applicants.* FROM applicants 
  JOIN interviews ON applicants.id = interviews.interviewersId
WHERE interviews.interviewersId = @interviewersId
`);

const getInterviewsForInterviewer = db.prepare(`
SELECT * FROM interviews WHERE interviewersId = @interviewersId`);

const createNewInterviewer = db.prepare(`
INSERT INTO interviewers (name,email) VALUES (@name, @email)`);

// // Interviews
const getALLInterviews = db.prepare(`
SELECT * FROM interviews`);

const getInterviewsById = db.prepare(`
SELECT * FROM interviews WHERE id = @id`);

const createNewInterview = db.prepare(`
INSERT INTO interviews (applicantsId, interviewersId, date,score) VALUES (@applicantsId, @interviewersId, @date, @score)`);



//  Applicants

app.get('/', (req,res) =>{
    res.send(`
    <h1> Applicants & Interviewers & Interviews</h1>
    <ul>
    <li><a href="/applicants"> Applicants </a> </li>
    <li><a href="/interviewers"> Interviewers </a> </li>
    <li><a href="/interviews"> Interviews </a> </li>
    

    </ul>`)
})

app.get("/applicants", (req, res) => {
  const applicants = getAllApplicants.all();
  res.send(applicants);
});

app.get("/applicants/:id", (req, res) => {
  const applicant = getApplicantById.get(req.params);

  if (applicant) {
    applicant.interviewers = getInterviewersForApplicant.all({
      applicantsId: applicant.id,
    });
    applicant.interviews = getInterviewersForApplicant.all({
      applicantsId: applicant.id,
    });
    res.send(applicant);
  } else {
    res.status(404).send({ error: "Applicant not Found!" });
  }
});
app.post("/applicants", (req, res) => {
  const errors: string[] = [];

  if (typeof req.body.name !== "string") {
    errors.push("Name it is not a string!");
  }
  if (typeof req.body.email !== "string") {
    errors.push("Email it is not a string!");
  }
  if (typeof req.body.position !== "string") {
    errors.push("Position it is not a string!");
  }
  if (errors.length === 0) {
    const info = createNewApplicant.run(req.body);
    const applicant = getApplicantById.get({ id: info.lastInsertRowid });
    res.send(applicant);
  } else {
    res.status(404).send({ errors: errors });
  }
});

// Interviewers

app.get("/interviewers", (req, res) => {
  const interviewers = getAllInterviewers.all();
  res.send(interviewers);
});

app.get("/interviewers/:id", (req, res) => {
  const interviewer = getInterviewerById.get(req.params);
  if (interviewer) {
    interviewer.interviews = getInterviewsForInterviewer.all({
      interviewersId: interviewer.id,
    });
    interviewer.applicants = getApplicantsForInterviewer.all({
      interviewersId: interviewer.id,
    });
    res.send(interviewer);
  } else {
    res.status(404).send({ error: "Interviewer not Found!" });
  }
});
app.post("/interviewers", (req, res) => {
  let errors: string[] = [];

  if (typeof req.body.name !== "string") {
    errors.push("Name it is not a string!");
  }
  if (typeof req.body.email !== "string") {
    errors.push("Email it is not a string!");
  }

  if (errors.length === 0) {
    const info = createNewInterviewer.run(req.body);
    const interviewer = getInterviewerById.get({ id: info.lastInsertRowid });
    res.send(interviewer);
  } else {
    res.status(404).send({ errors: errors });
  }
});

//  Interviews

app.get("/interviews", (req, res) => {
  const interviews = getALLInterviews.all();
  res.send(interviews);
});

app.get("/interviews/:id", (req, res) => {
    
  const interview = getInterviewsById.get(req.params)
 
  if (interview) {

    interview.applicant = getApplicantById.get({ applicantsId: interview.applicantsId});
    interview.interviewer = getInterviewerById.get({interviewersId: interview.interviewersId});
    res.send(interview);
  } else {
    res.status(404).send("Interview not Found!");
  }
});

app.post("/interviews", (req, res) => {
  let errors: string[] = [];

  if (typeof req.body.applicantsId !== "number") {
    errors.push("  ApplicantsId It is not a number!");
  }
  if (typeof req.body.interviewersId !== "number") {
    errors.push(" interviewersId  It is not a number!");
  }
  if (typeof req.body.date !== "string") {
    errors.push("  Date It is not a string!");
  }
  if (typeof req.body.score !== "number") {
    errors.push("  Score It is not a number!");
  }

  if (errors.length === 0) {
    const info = createNewInterview.run(req.body);
    const interview = getInterviewsById.get({ id: info.lastInsertRowid });
    res.send(interview);
  } else {
    res.status(404).send({ errors: errors });
  }
});

app.listen(port, () => {
  console.log(`YAYY: http://localhost:${port}`);
});
