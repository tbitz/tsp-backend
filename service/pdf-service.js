const PDFDocument = require("pdfkit-table");

function createPDF(
  allRows,
  allRecords,
  rangeStart,
  rangeEnd,
  rangeDays,
  dataCallback,
  endCallback
) {
  const doc = new PDFDocument();

  const summaryTable = {
    title: "Zusammenfassung",
    headers: ["User", "Total Stunden", "Total Minuten"],
    rows: [...allRows],
  };

  const fullTable = {
    title: "Detailansicht",
    headers: ["User", "Minuten", "Start", "Ende"],
    rows: [...allRecords],
  };

  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  doc.fontSize(25).text("Zeitrapport", 100, 100);
  doc.fontSize(18).text(`${rangeStart} - ${rangeEnd} (${rangeDays} Tage)`);

  doc.moveDown();

  doc.table(summaryTable, {
    columnsSize: [200, 100, 100],
  });

  doc.table(fullTable, {
    columnsSize: [150, 100, 100, 100],
  });

  doc.end();
}

module.exports = { createPDF };
