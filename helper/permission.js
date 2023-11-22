export function roles_permission() {
  return async (req, res, next) => {
    var user = await req.user;
    var fullname = user.name + " " + user.family;
    for (let item in arguments) {
      if (arguments[item] == user.role) {
        return next();
      }
    }
    return res.render("not-allowed", {
      user,
      fullname,
      request_number: global.request_number,
      deliver_number: global.deliver_number,
      page_name: "عدم مجوز ورود"
    });
  };
}
export function groups_permission() {
  return async (req, res, next) => {
    var user = await req.user;
    var fullname = user.name + " " + user.family;
    for (let item in arguments) {
      if (arguments[item] == user.group) {
        return next();
      }
    }
    return res.render("not-allowed", { user, fullname, request_number: global.request_number, page_name: "عدم مجوز ورود" });
  };
}
