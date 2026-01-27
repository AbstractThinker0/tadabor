export const htmlNote = (
  noteTitle: string,
  verseText: string = "",
  noteText: string,
  noteDir = ""
) => {
  return `<div class='note'><div class='note-title'>${noteTitle}<br />${verseText}</div><div class='note-content' dir='${noteDir}'>${noteText}</div></div>`;
};

const htmlContainer = (data: string) => {
  const htmlStyle = `
  <style>
    * {
    font-size: 18px;
    }

    body {
      padding: 2rem;
      background-color: #f5f5f5;
      color: #333;
    }

    .note {
      border-radius: 15px;
      margin-bottom: 1.5rem;
      background-color: #fff;
    }

    .note-title {
      background-color: #66c2b2;
      color: #fff;
      border-radius: 15px;
      padding: 1.5rem;
      font-size: larger;
    }

    .note-content {
      border-radius: 15px;
      padding: 1.5rem;
      white-space: pre-wrap;
    }
  </style>`.replace(/\n/g, "");

  return `<html><head>${htmlStyle}</head><body><div dir='rtl'>${data}</div></body></html>`;
};

export const downloadNotesFile = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data)], {
    type: "application/json;charset=utf-8",
  });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `${filename}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
  document.body.removeChild(downloadLink);
};

export const downloadHtmlFile = (data: string, filename: string) => {
  const blob = new Blob([htmlContainer(data)], {
    type: "text/html;charset=utf-8",
  });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `${filename}.html`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  URL.revokeObjectURL(downloadLink.href);
  document.body.removeChild(downloadLink);
};
