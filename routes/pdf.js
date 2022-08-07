const router = require("express").Router();
const auth = require("../middleware/auth");
const pdfService = require("../service/pdf-service");

router.post("/generate", auth, async (req, res) => {
  const stream = res.writeHead(200, {
    "Content-type": "application/pdf",
    "Content-disposition": "attachment;filename=Zeitrapport.pdf",
  });

  pdfService.createPDF(
    req.body.allRows,
    req.body.allRecords,
    req.body.rangeStart,
    req.body.rangeEnd,
    req.body.rangeDays,

    (chunk) => stream.write(chunk),
    () => stream.end()
  );
});

module.exports = router;
