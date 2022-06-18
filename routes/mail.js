const router = require("express").Router();
const nodemailer = require("nodemailer");
const { Project } = require("../models/project");
const { Column } = require("../models/column");
const { User } = require("../models/user");

// send mail
// SECURITY: remove user and only send userId
router.post("/", async (req, res) => {
  let { task } = req.body;
  const user = await User.findById(task.assignee.id);
  const project = await Project.findById(task.projectId);
  const column = await Column.findById(task.columnId);

  const endDateContent = task?.endDate
    ? `<p>Der Task endet am: ${task.endDate.slice(0, 10)}</p>`
    : "";

  const transport = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    service: "yahoo",
    secure: false,
    auth: {
      user: process.env.MAIL_FROM,
      pass: process.env.MAIL_PASS,
    },
    debug: false,
    logger: true,
  });

  const mail = {
    from: process.env.MAIL_FROM,
    to: user.email,
    subject: `Ein Task wurde dir zugewiesen: ${task.title.substring(0, 20)}...`,
    html: `<div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px; 
        ">
        <h2>${user.name} hat dir einen Task zugewiesen!</h2>
        <p>Titel: ${task.title}</p>
        <p>Projekt: ${project.name}</p>
        <p>Kolumne: ${column.title}</p>
        ${endDateContent}
        <p>Viel Erfolg!</p>
         </div>
    `,
    text: `${user.name} hat dir einen Task zugewiesen!\nProjekt: ${project.name}\nKolumne: ${column.title}\n${endDateContent}\nViel Erfolg!`,
  };

  transport.sendMail(mail, function (err, data) {
    if (err) {
      res.send({ message: `Mail error, ${err}` });
    } else {
      res.send({ message: "Mail sent" });
    }
  });
});

module.exports = router;
