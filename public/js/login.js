const login_form = document.getElementById("login");
const register_form = document.getElementById("register");
const message = document.getElementById("message");
const change_pass = document.getElementById("change_pass");
let spinner = document.getElementsByClassName("spinner-border")[0];
let btn = document.querySelector("button");
let login_text = document.getElementById("login-text");
let input = document.querySelector("input");

async function login(event) {
  event.preventDefault();
  const login = document.getElementById("login_input").value;
  const password = document.getElementById("password_input").value;
  spinner.classList.add("d-none");
  login_text.innerHTML = ``;
  btn.disabled = true;
  const { data } = await axios.post("/login", { login, password });
  spinner.classList.remove("d-none");
  if (data.success) {
    // success_izitoast(data.message)
    localStorage.userRole = data.user.role;
    setTimeout(() => {
      window.location.href = "/home";
    }, 100);
  } else {
    spinner.classList.add("d-none");
    login_text.innerHTML = `ورود`;
    btn.disabled = false;
    error_izitoast(data.message);
  }
}

if (login_form) {
  input.focus();
  login_form.addEventListener("submit", async (event) => {
    login(event);
  });
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      login(event);
    }
  });
}

if (register_form) {
  register_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const login = document.getElementById("login_input").value;
    const password = document.getElementById("password_input").value;
    const name = document.getElementById("name_input").value;
    const family = document.getElementById("family_input").value;
    const group = document.getElementById("group_input").value;
    const role = document.getElementById("role_input").value;
    const confirm_password = document.getElementById("confirm_password_input").value;
    if (password != confirm_password) {
      error_izitoast("کلمه عبور و تکرار آن باید یکسان باشند");
    } else {
      const { data } = await axios.post("/user/register-user", { group, name, family, login, role, password });
      if (data.success) {
        success_izitoast(data.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
      } else {
        error_izitoast(data.message);
      }
    }
  });
}

if (change_pass) {
  change_pass.addEventListener("submit", async (event) => {
    event.preventDefault();
    const old_pass = document.getElementById("old_pass").value;
    const new_pass = document.getElementById("new_pass").value;
    const { data } = await axios.post("/change-password", { old_pass, new_pass });
    if (data.success) {
      success_izitoast(data.message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } else {
      error_izitoast(data.message);
    }
  });
}
