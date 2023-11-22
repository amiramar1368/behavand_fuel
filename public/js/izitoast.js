iziToast.settings({
  timeout: 2000, // default timeout
  resetOnHover: true,
  // icon: '', // icon class
  transitionIn: "flipInX",
  transitionOut: "flipOutX",
  position: "topCenter", // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
  onOpen: function () {
    console.log("callback abriu!");
  },
  onClose: function () {
    console.log("callback fechou!");
  },
});

function success_izitoast(text) {
  iziToast.success({ message: text });
  // iziToast.success({ timeout: 3000, icon: "fa fa-chrome", title: "موفقیت", message: text });
}
function warning_izitoast(text) {
  iziToast.warning({ position: "bottomLeft", title: "Caution", message: text });
}
function error_izitoast(text) {
  iziToast.error({ timeout: 2000, message: text });
}
