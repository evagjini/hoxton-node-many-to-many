import Database from "better-sqlite3";
const db = Database("./db/data.db", { verbose: console.log });

const applicants = [
  {
    name: "Eva Gjini",
    email: "evagj@hotmail.com",
    position: "Full Stack Developer",
  },
  {
    name: "Mandi Ndoj",
    email: "mandin@gmail.com",
    position: "Software Backend Engineer ",
  },
  {
    name: "Tida Nika",
    email: "tidagj@yahoo.com",
    position: "Junior  Developer",
  },
  {
    name: "Reni Brown",
    email: "renib@hotmail.com",
    position: "Full Stack",
  },
];

const interviewers = [
  {
    name: "Nicolas Marcora",
    email: "nicolasm@gmail.com",
  },
  {
    name: "Ed Putans",
    email: "edp@gmail.com",
  },
  {
    name: " Leo Lesi",
    email: "leol@hotmail.com",
  },
];

const interviews = [
  {
    applicantsId: 1,
    interviewersId: 1,
    date: "25.06.2023",
    score: 10,
  },
  {
    applicantsId: 1,
    interviewersId: 2,
    date: "04.06.2023",
    score: 9,
  },
  {
    applicantsId: 1,
    interviewersId: 3,
    date: "17.05.2023",
    score: 10,
  },
  {
    applicantsId: 2,
    interviewersId: 2,
    date: "02.06.2023",
    score: 9,
  },
  {
    applicantsId: 2,
    interviewersId: 3,
    date: "06.10.2022",
    score: 9,
  },
  {
    applicantsId: 3,
    interviewersId: 3,
    date: "08.11.2022",
    score: 10,
  },
  {
    applicantsId: 4,
    interviewersId: 1,
    date: "09.06.2023",
    score: 9,
  },
  {
    applicantsId: 4,
    interviewersId: 2,
    date: "25.12.2022",
    score: 8,
  },
];

const dropInterviewersTable = db.prepare(`
    DROP TABLE  IF EXISTS interviwers `);
dropInterviewersTable.run();

const dropApplicantsTable = db.prepare(`
    DROP TABLE IF EXISTS applicants`);
dropApplicantsTable.run();

const createApplicantsTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS applicants (
       id INTEGER,
       name TEXT NOT NULL,
       email TEXT NOT NULL,
       position TEXT NOT NULL,
       PRIMARY KEY (id)
    );
    `);
createApplicantsTable.run();

const createApplicant = db.prepare(`
    INSERT INTO applicants (name, email, position) VALUES (@name, @email, @position);`);

for (let applicant of applicants) {
  createApplicant.run(applicant);
}

const createInterviewersTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS interviewers(
        id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        PRIMARY KEY (id)

    );
    `);

createInterviewersTable.run();

const creatInterviewer = db.prepare(`
     INSERT INTO interviewers (name, email) VALUES (@name, @email)`);

for (let interviewer of interviewers) {
  creatInterviewer.run(interviewer);
}

const dropInterviewsTable = db.prepare(`
     DROP TABLE IF EXISTS interviews`);

dropInterviewsTable.run();

const createInterviewsTable = db.prepare(`
     CREATE TABLE IF NOT EXISTS interviews (
        id INTEGER,
        applicantsId INTEGER,
        interviewersId INTEGER,
        date TEXT NOT NULL,
        score INTEGER,
        PRIMARY KEY(id),
        FOREIGN KEY (applicantsId) REFERENCES applicants(id) ON DELETE CASCADE,
        FOREIGN KEY (interviewersId) REFERENCES interviewers(id) ON DELETE CASCADE
        
     )
     `);

createInterviewsTable.run();

const createInterview = db.prepare(`
     INSERT INTO interviews (applicantsId, interviewersId, date, score) VALUES (@applicantsId, @interviewersId, @date, @score)
     `);

for (let interview of interviews) {
  createInterview.run(interview);
}
