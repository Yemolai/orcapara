function exportTo(format) {
  if (!customizable) return false;
  var options = {
    escape: true,
    htmlContents: true
  };
  switch (format) {
    case 'PDF':
      var doc = new jsPDF('p', 'pt', 'a4');
      var tbl = document.getElementById('dtl');
      var res = doc.autoTableHtmlToJson(tbl);
      var header = function(data) {
          doc.setFontSize(18);
          doc.setTextColor(40);
          doc.setFontStyle('normal');
          //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
          doc.text($("#titulo").text(), data.settings.margin.left, 50);
      };
      var tableOpts = {
        margin: {
          top: 120
        },
        beforePageContent: header,
        bodyStyles: {
          overflow: 'linebreak',
          cellPadding: 3,
          fontSize: 8,
          columnWidth: 'wrap'
        }
      };
      doc.autoTable(res.columns, res.data, tableOpts);
      doc.output('save','table.pdf');
      return true;
      break;
    case 'XLS':
      options.type = 'excel';
      break;
    case 'CSV':
      options.type = 'csv';
      break;
    case 'JSON':
      options = {type: 'json', escape: true};
      break;
    case 'DOC':
      options.type = 'doc';
      break;
    case 'XML':
      options = {type: 'xml', escape: true};
    default:
      options.type = 'txt';
      break;
      console.log('formato desconhecido');
  }
  return $("#dtl").tableExport(options);
}
