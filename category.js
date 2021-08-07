const fs = require("fs");
const fsPromises = fs.promises;

const inputPath = process.argv[2];
const categories = process.argv[3];
const tags = process.argv[4];
const files = fsPromises.readdir(inputPath);

files
  .then((result) => {
    const targetFiles = [];
    for (const fileName of result) {
      if (fileName === ".DS_Store" || fileName === "imgs") continue;
      const fileFullPath = `${inputPath}/${fileName}`;
      targetFiles.push({
        fileFullPath,
        fileName,
      });
    }
    return targetFiles;
  })
  .then(appnendTitle)
  .catch(console.log);

async function appnendTitle(fileList) {
  for (const path of fileList) {
    const { fileFullPath, fileName } = path;
    const text = `---
title: ${fileName.split("-").slice(1).join("-").slice(0, -3)}
date: ${getDate()}
tags: ${tags}
categories: ${categories}
---
`;
		const textBuf = Buffer.from(text, 'utf-8');
    const file = await fsPromises.readFile(fileFullPath);
    const newFile = Buffer.concat([textBuf, file])

		await fsPromises.writeFile(fileFullPath, newFile);
  }
}

function getDate() {
	const date = new Date();
	const year = date.getFullYear() 
	const month =String(date.getMonth()+1).padStart( 2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minut = String(date.getMinutes()).padStart(2, "0");
	const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minut}:${second}`;
}
