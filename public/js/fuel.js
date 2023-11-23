// let loading = document.getElementById("loading");
// let wait_import_file_btn = document.getElementById("wait-import-file");
const import_excel_file = document.getElementById("import-fuel-files");

if (import_excel_file) {
  import_excel_file.addEventListener("change", async (event) => {
    const form = new FormData();

    const files = event.target.files;
    for(let i=0 ; i<files.length ; i++){
      console.log(files[i]);
      form.append("file", files[i]);
      const { data } = await axios.post("/fuels/import-files", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  });
}
