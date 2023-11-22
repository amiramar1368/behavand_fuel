const import_excel_file = document.getElementById("import-fuel-files");
// let loading = document.getElementById("loading");
// let wait_import_file_btn = document.getElementById("wait-import-file");

if (import_excel_file) {
  import_excel_file.addEventListener("change", async (event) => {
    // import_excel_file.classList.toggle("d-none");
    // wait_import_file_btn.classList.toggle("d-none");
    const form = new FormData();
    const files = [];
    // const files =event.target.files[0];
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(event.target.files[i]);
    }
    console.log(files);
    form.append("files", files);
    var { data } = await axios.post("/fuels/import-files", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // import_excel_file.classList.toggle("d-none");
    // wait_import_file_btn.classList.toggle("d-none");
    if (data.success) {
      success_izitoast(data.message);
    } else {
      error_izitoast(data.message);
    }
  });
}
