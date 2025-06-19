// utils/fileHelpers.js

// export const saveCanvasToFile = async (canvas, defaultName = "canvas.json") => {
//   const json = JSON.stringify(canvas.toJSON());

//   const blob = new Blob([json], { type: "application/json" });
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = defaultName;
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url);
// };

// export const saveCanvasToFile = async (canvas, existingHandle = null) => {
//   const json = JSON.stringify(canvas.toJSON(), null, 2);

//   let fileHandle = existingHandle;

//   // If no existing file handle, ask user where to save
//   if (!fileHandle) {
//     try {
//       fileHandle = await window.showSaveFilePicker({
//         suggestedName: "canvas.json",
//         types: [
//           {
//             description: "JSON Files",
//             accept: { "application/json": [".json"] },
//           },
//         ],
//       });
//     } catch (err) {
//       console.warn("User cancelled save.");
//       return;
//     }
//   }

//   // Create writable stream
//   const writable = await fileHandle.createWritable();
//   await writable.write(json);
//   await writable.close();

//   return fileHandle; // ✅ Return so you can reuse it next time
// };

export const saveCanvasToFile = async (canvas, fileName = "canvas.json", existingHandle = null) => {
  const json = JSON.stringify(canvas.toJSON(), null, 2);
  let fileHandle = existingHandle;

  // If no file handle, show Save As dialog with suggested file name
  if (!fileHandle) {
    try {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName.endsWith('.json') ? fileName : `${fileName}.json`,
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
      });
    } catch (err) {
      console.warn("User cancelled the save dialog.");
      return null;
    }
  }

  const writable = await fileHandle.createWritable();
  await writable.write(json);
  await writable.close();

  return fileHandle; // So it can be reused for future saves
};



export const loadCanvasFromFile = async (canvas) => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const json = event.target.result;
        const parsed = JSON.parse(json);

        canvas.loadFromJSON(parsed, () => {
          canvas.renderAll();
          resolve({ name: file.name.replace(".json", ""), content: parsed });
        });
      };
      reader.onerror = reject;
      reader.readAsText(file);
    };

    input.click();
  });
};

