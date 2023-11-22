import { Op } from "sequelize";
import bcrypt from "bcrypt";
import formidable from "formidable";
import XLSX from "xlsx";

import { sequelize } from "../model/db.js";
import { groups } from "../config.js";
import { jalai_to_miladi, miladi_to_jalali } from "../helper/date-convertor.js";
import { validate_date } from "../helper/validate-date.js";
import { logger } from "../helper/winston.js";
import { yup_user, yup_attach_user } from "../helper/yup.js";


export class Fuel {

  static async import_files(req, res) {
      const user = await req.user;
    
      const form = formidable({ multiples: true });
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.log("error in import machine : ", err);
          return res.json({ success: false, message: "خطا در ایمپورت فایل" });
        }
        console.log(files);
        return res.json({
          files,
          success: false,
          message: "تنها مجاز به آپلود فایل اکسل می باشید",
        });
      })
    }

  // static async import_files(req, res) {
  //   try {
  //     const user = await req.user;
    
  //     const form = formidable({ multiples: true });
  //     form.parse(req, async (err, fields, files) => {
  //       if (err) {
  //         console.log("error in import machine : ", err);
  //         return res.json({ success: false, message: "خطا در ایمپورت فایل" });
  //       }
  //       console.log(10);
  //       console.log(files);
  //       return res.json({
  //         files,
  //         success: false,
  //         message: "تنها مجاز به آپلود فایل اکسل می باشید",
  //       });
  //       const file_path = files.file.filepath;
  //       const file_type = files.file.originalFilename.split(".")[1];
  //       if (file_type != "xlsx") {
  //         return res.json({
  //           success: false,
  //           message: "تنها مجاز به آپلود فایل اکسل می باشید",
  //         });
  //       }
  //       const workbook = XLSX.readFile(file_path);
  //       const sheets = workbook.SheetNames;
  //       const sheet = workbook.Sheets[sheets[0]];
  //       const data = XLSX.utils.sheet_to_json(sheet);
  //       const keys = Object.keys(data[0]);

  //       const allowed_keys = [
  //         "پیمانکار",
  //         "نوع ماشین",
  //         "نام ماشین",
  //         "شماره سخت افزار",
  //         "وضعیت ماشین",
  //       ];

  //       for (let i = 1; i < keys.length; i++) {
  //         if (!allowed_keys.includes(keys[i])) {
  //           return res.json({
  //             success: false,
  //             message: "فرمت اکسل وارد شده صحیح نمی باشد",
  //           });
  //         }
  //       }

  //       try {
  //         for (let i = 0; i < data.length; i++) {
  //           let name = String(data[i]["نام ماشین"]).trim().toUpperCase();
  //           // await req.models.Machine.create({
  //           //   created_by: user.id,
  //           //   group: user.group,
  //           //   contractorId,
  //           //   machine_type: type.id,
  //           //   name,
  //           //   machine_id,
  //           //   status: machine_state,
  //           //   pm_period: type.pm_period,
  //           // });
  //         }
  //       } catch (err) {
  //         console.log("import machine :", err);
  //         // check for duplicate code in imported excell
  //         // if (err.errors[0].type == "unique violation") {
  //         //   return res.json({
  //         //     success: false,
  //         //     message:
  //         //       "امکان وارد کردن ماشین با نام یا شماره سخت افزار تکراری وجود ندارد",
  //         //   });
  //         // } else {
  //         //   return res.json({
  //         //     success: false,
  //         //     message: "خطا در ایمپورت ماشین آلات",
  //         //   });
  //         // }
  //       }
  //       return res.json({
  //         success: true,
  //         message: "با موفقیت ایمپورت گردید",
  //       });
  //     });
  //   } catch (err) {
  //     logger.log("error", `admin-controller _ import_machine() : ${err}`);
  //     res.json({ success: false, message: "خطا در ایمپورت ماشین آلات" });
  //   }
  // }
}

export class User {
  static async add_user(req, res) {
    try {
      const user = await req.user;
      var fullname = user.name + " " + user.family;
      const { method } = req;
      if (method == "GET") {
        res.render("user", {
          page_name: "تعریف کاربر",
          user,
          fullname,
          request_number: global.request_number,
          deliver_number: global.deliver_number,
        });
      }
      if (method == "POST") {
        let { password, confirm_password, login, personal_code } = req.body;
        login = login.trim();
        await yup_user.validate(req.body, { abortEarly: false });
        if (password != confirm_password) {
          return res.json({
            success: false,
            message: "کلمه عبور و تکرار آن باید یکسان باشد",
          });
        }
        const isExist = await req.models.User.findOne({
          where: {
            group: user.group,
            [Op.or]: [{ personal_code }, { login }],
          },
        });
        if (isExist) {
          return res.json({
            success: false,
            message: "کاربری با این کد پرسنلی یا نام کاربری قبلا تعریف شده است",
          });
        } else {
          password = await bcrypt.hash(req.body.password, 10);
          await req.models.User.create({
            created_by: user.id,
            group: user.group,
            ...req.body,
            password,
          });
          return res.json({ success: true, message: "با موفقیت ثبت شد" });
        }
      }
    } catch (err) {
      logger.log("error", `admin-controller _ add_user() : ${err}`);
      res.json({ success: false, message: "عملیاتd ناموفق" });
    }
  }
  static async attach_user(req, res) {
    try {
      const user = await req.user;
      var fullname = user.name + " " + user.family;

      const { method } = req;
      if (method == "GET") {
        const contractors = await req.models.Contractor.findAll({
          where: { group: user.group },
        });
        res.render("attach-user", {
          page_name: "انتساب پرسنل به اتاق",
          user,
          contractors,
          fullname,
          request_number: global.request_number,
          deliver_number: global.deliver_number,
        });
      }
      if (method == "POST") {
        var { contractorId, room_name, buildingId, description, users_id } =
          req.body;

        let isValid = await yup_attach_user.validate(req.body, {
          abortEarly: false,
        });

        //check for => is this room_name empty or not
        var attach_building = await req.models.Attach_User.findAll({
          where: { room_name, group: user.group },
          include: [req.models.Contractor_Building],
        });
        if (attach_building.length > 0) {
          for (let i = 0; i < attach_building.length; i++) {
            var id_build = attach_building[i].contractor_building.buildingId;
            var id_contractor =
              attach_building[i].contractor_building.contractorId;

            // (id==buildingId) means this room is not empty;
            if (id_build == buildingId && id_contractor == contractorId) {
              var users_id_for_db = users_id.join("&");
              var contractor_building_id =
                attach_building[i].contractorBuildingId;
              var attached_room = attach_building.find(
                (item) => item.contractorBuildingId == contractor_building_id,
              );
              attached_room.users_id += "&" + users_id_for_db;
              attached_room.save();

              //update user set is_allocate=1, buildingId,room_name;
              for (let i = 0; i < users_id.length; i++) {
                await req.models.User.update(
                  { is_allocated: "1", room_name, buildingId },
                  { where: { id: users_id[i] } },
                );
              }

              return res.json({ success: true, message: "با موفقیت ثبت شد" });
            }
          }
        }

        var contractorBuilding = await req.models.Contractor_Building.findOne({
          where: { contractorId, buildingId },
        });

        for (let i = 0; i < users_id.length; i++) {
          var user1 = await req.models.User.findByPk(users_id[i]);
          user1.buildingId = buildingId;
          user1.room_name = room_name;
          await user1.save();
        }

        var users_id_for_db = users_id.join("&");
        const record = await req.models.Attach_User.create({
          created_by: user.id,
          group: user.group,
          contractorBuildingId: contractorBuilding.id,
          room_name,
          description,
          users_id: users_id_for_db,
        });

        //set is_allocated for user equal to "1"
        for (let i = 0; i < users_id.length; i++) {
          var user2 = await req.models.User.findByPk(users_id[i]);
          user2.is_allocated = "1";
          await user2.save();
        }

        return res.json({ success: true, message: "با موفقیت ثبت شد" });
      }
    } catch (err) {
      logger.log("error", `admin-controller _ attach_user() : ${err}`);
      res.json({ success: false, message: "عملیات ناموفق" });
    }
  }

  static async user_activity(req, res) {
    try {
      const user = await req.user;
      var fullname = user.name + " " + user.family;
      const { method } = req;
      if (method == "GET") {
        const users = await req.models.User.findAll({
          where: {
            group: user.group,
            id: { [Op.ne]: 1 },
            [Op.or]: [
              { unit: "سخت افزار" },
              { unit: "اداری" },
              { unit: "راننده" },
            ],
          },
        });
        const activities = await req.models.Activity.findAll({
          where: { group: user.group, unit: "سخت افزار" },
        });
        const contractors = await req.models.Contractor.findAll({
          where: { group: user.group },
        });
        const machine_types = await req.models.Machine_Type.findAll({
          where: { group: user.group },
        });
        const dakals = await req.models.Machine.findAll({
          where: { name: { [Op.like]: "%دکل%" } },
        });
        const boards = await req.models.Board.findAll({
          where: { id: { [Op.ne]: 1 } },
        });
        const convertors = await req.models.Convertor.findAll({
          where: { id: { [Op.ne]: 1 } },
        });
        res.render("user-activity", {
          page_name: "ثبت فعالیت انجام شده",
          user,
          dakals,
          boards,
          convertors,
          users,
          activities,
          contractors,
          machine_types,
          fullname,
          request_number: global.request_number,
          deliver_number: global.deliver_number,
        });
      }
      if (method == "POST") {
        let {
          dakalId,
          activityId,
          boardId,
          machineId,
          convertorId,
          first_repairman,
          second_repairman,
          thirth_repairman,
          activity_date,
          description,
          code,
        } = req.body;
        description = description.trim();
        if (!validate_date(activity_date)) {
          return res.json({
            success: false,
            message: "تاریخ به درستی وارد نشده است",
          });
        }
        activity_date = jalai_to_miladi(activity_date);
        const isExist = await req.models.Activity.findByPk(activityId);
        if (!isExist) {
          return res.json({
            success: false,
            message: "این فعالیت در سیستم وجود ندارد",
          });
        }
        if (code != "") {
          const good = await req.models.Good.findOne({ where: { code } });
          if (!good) {
            return res.json({
              success: false,
              message: "این کد در سیستم وجود ندارد",
            });
          }
        }
        if (first_repairman) {
          const user1isExist = await req.models.User.findByPk(first_repairman);
          if (!user1isExist) {
            return res.json({
              success: false,
              message: "این کاربر در سیستم وجود ندارد",
            });
          }
        } else {
          first_repairman = 1;
        }
        if (second_repairman) {
          const user2isExist = await req.models.User.findByPk(second_repairman);
          if (!user2isExist) {
            return res.json({
              success: false,
              message: "این کاربر در سیستم وجود ندارد",
            });
          }
        } else {
          second_repairman = 1;
        }
        if (thirth_repairman) {
          const user2isExist = await req.models.User.findByPk(second_repairman);
          if (!user2isExist) {
            return res.json({
              success: false,
              message: "این کاربر در سیستم وجود ندارد",
            });
          }
        } else {
          thirth_repairman = 1;
        }
        if (dakalId == "") {
          dakalId = 0;
        }
        if (machineId == "") {
          machineId = 0;
        }
        if (convertorId == "") {
          convertorId = 1;
        }
        if (boardId == "") {
          boardId = 1;
        }

        await req.models.User_Activity.create({
          created_by: user.id,
          group: user.group,
          ...req.body,
          first_repairman,
          second_repairman,
          thirth_repairman,
          activity_date,
          dakalId,
          boardId,
          machineId,
          convertorId,
          code,
          description,
        });
        return res.json({ success: true, message: "با موفقیت ثبت شد" });
      }
    } catch (err) {
      logger.log("error", `admin-controller _ user_activity() : ${err}`);
      res.json({ success: false, message: "عملیات ناموفق" });
    }
  }
  static async activity_list(req, res) {
    try {
      const user = await req.user;
      var fullname = user.name + " " + user.family;
      const { method } = req;
      if (method == "GET") {
        res.render("activity", {
          page_name: "ثبت فعالیت",
          title: "ثبت فعالیت",
          user,
          fullname,
          request_number: global.request_number,
          deliver_number: global.deliver_number,
        });
      }
      if (method == "POST") {
        let { activity, unit } = req.body;
        activity = activity.toUpperCase().trim();
        if (!["اداری", "سخت افزار", "راننده"].includes(unit)) {
          return res.json({
            success: false,
            message: " این واحد تعریف نشده است",
          });
        }
        const isExist = await req.models.Activity.findOne({
          where: {
            group: user.group,
            activity,
          },
        });
        if (isExist) {
          return res.json({
            success: false,
            message: " این فعالیت قبلا تعریف شده است",
          });
        }
        await req.models.Activity.create({
          created_by: user.id,
          group: user.group,
          activity,
          unit,
        });
        return res.json({ success: true, message: "با موفقیت ثبت شد" });
      }
    } catch (err) {
      logger.log("error", `admin-controller _ activity_list() : ${err}`);
      res.json({ success: false, message: "عملیات ناموفق" });
    }
  }

  static async sub_activity(req, res) {
    try {
      const user = await req.user;
      var fullname = user.name + " " + user.family;
      const { method } = req;
      if (method == "GET") {
        const activities = await req.models.Activity.findAll({
          where: { group: user.group },
        });
        res.render("sub-activity", {
          page_name: "ثبت زیر مجموعه فعالیت",
          activities,
          user,
          fullname,
          request_number: global.request_number,
          deliver_number: global.deliver_number,
        });
      }
      if (method == "POST") {
        let { activityId, sub_activity } = req.body;
        sub_activity = sub_activity.toUpperCase().trim();
        const activity = await req.models.Activity.findByPk(activityId);
        if (!activity) {
          return res.json({
            success: false,
            message: " این فعالیت در سیستم وجود ندارد",
          });
        }
        const isExist = await req.models.Sub_Activity.findOne({
          where: {
            group: user.group,
            activityId,
            sub_activity,
          },
        });
        if (isExist) {
          return res.json({
            success: false,
            message: " این فعالیت قبلا تعریف شده است",
          });
        }
        await req.models.Sub_Activity.create({
          created_by: user.id,
          group: user.group,
          activityId,
          sub_activity,
        });
        return res.json({ success: true, message: "با موفقیت ثبت شد" });
      }
    } catch (err) {
      logger.log("error", `admin-controller _ sub_activity() : ${err}`);
      res.json({ success: false, message: "عملیات ناموفق" });
    }
  }
}

async function remain_in_warehouse(req, res) {
  try {
    var user = await req.user;
    var fullname = user.name + " " + user.family;
    const request = await req.models.Request_Good.findAll({
      where: { group: user.group, status: "درخواست شده" },
    });
    const deliver = await req.models.Deliver_Good.findAll({
      where: { group: user.group, status: 1 },
    });
    global.request_number = request.length;
    global.deliver_number = deliver.length;
    var warehouse_goods = await req.models.Warehouse_Stock.findAll({
      include: [req.models.Good, req.models.Warehouse],
    });
    var warehouse_good = warehouse_goods.filter(
      (item) => item.remain > 0 && item.remain < 10,
    );
    var goods_name = [];
    var goods = [];
    for (let i = 0; i < warehouse_good.length; i++) {
      var number = warehouse_good[i].remain;
      var good = warehouse_good[i].good.name;
      var warehouse = warehouse_good[i].warehouse.name;
      var code = warehouse_good[i].good.code;
      goods.push({ warehouse, good, number, code });
    }

    var alarm_good = [];
    var has_code_goods = [];
    var counter = {};
    for (let i = 0; i < goods.length; i++) {
      if (goods[i].code != "0") {
        has_code_goods.push(goods[i]);
        goods_name.push(goods[i].good);
      } else {
        alarm_good.push(goods[i]);
      }
    }

    var unique_goods_name = goods_name.filter(
      (arr, index, self) => index === self.findIndex((t) => t === arr),
    );
    var counter = [];
    for (let j = 0; j < unique_goods_name.length; j++) {
      counter[j] = 0;
      for (let i = 0; i < has_code_goods.length; i++) {
        if (has_code_goods[i].good == unique_goods_name[j]) {
          counter[j] += has_code_goods[i].number;
        }
      }
    }
    for (let i = 0; i < unique_goods_name.length; i++) {
      alarm_good.push({
        warehouse: "همه انبارها",
        good: unique_goods_name[i],
        number: counter[i],
        has_code: "بله",
      });
    }

    res.render("main", {
      page_name: "موجودی های رو به اتمام",
      user,
      alarm_good,
      fullname,
      request_number: global.request_number,
      deliver_number: global.deliver_number,
    });
  } catch (err) {
    logger.log("error", `admin-controller _ remain_in_warehouse() : ${err}`);
  }
}

export class Home {
  static async main_page(req, res) {
    try {
      var user = await req.user;
      var fullname = user.name + " " + user.family;
      res.render("main-page", {
        page_name: "گزارش سوخت گیری",
        user,
        fullname,
      });
    } catch (err) {
      logger.log("error", `admin-controller _ main_page() : ${err}`);
      res.render("main", {
        page_name: "گزارش سوخت گیری",
        user,
        fullname,
      });
    }
  }

  static async remain(req, res) {
    remain_in_warehouse(req, res);
  }
}

export class Login {
  static login(req, res) {
    try {
      res.render("login", {
        user: "",
        fullname: "",
        request_number: 0,
        deliver_number: 0,
        layout: "./layout/loginLayout.ejs",
      });
    } catch (err) {
      logger.log("error", `admin-controller _ login() : ${err}`);
    }
  }
  static async register(req, res) {
    try {
      const user = await req.user;
      var fullname = user.name + " " + user.family;
      if (user.id != 1) {
        return res.render("not-allowed", {
          page_name: "عدم دسترسی",
          user,
          fullname,
          request_number: global.request_number,
          deliver_number: global.deliver_number,
        });
      }
      const { method } = req;
      if (method == "GET") {
        res.render("register", { layout: "./layout/loginLayout.ejs" });
      } else if (method == "POST") {
        const { login, name, family, group, role } = req.body;
        if (!groups.includes(group)) {
          return res.json({
            success: false,
            message: "گروه وارد شده مجاز نمی باشد",
          });
        }
        // if (!roles_list.includes(role)) {
        //   return res.json({
        //     success: false,
        //     message: "نقش وارد شده مجاز نمی باشد",
        //   });
        // }
        const admin = await req.models.Admin.findOne({
          where: { login: req.body.login },
        });
        if (admin) {
          return res.json({
            success: false,
            message: "کاربری با این نام قبلا تعریف شده است",
          });
        }
        const password = await bcrypt.hash(req.body.password, 10);
        await req.models.Admin.create({
          login,
          group,
          name,
          family,
          role,
          password,
        });
        res.json({ success: true, message: "با موفقیت ثبت شد" });
      }
    } catch (err) {
      logger.log("error", `admin-controller _ login() : ${err}`);
      res.json({ success: false, message: "ثبت نشد" });
    }
  }

  static logout(req, res) {
    try {
      res.cookie("token", "", { maxAge: -100, httpOnly: true });
      res.render("login", {
        user: "",
        fullname: "",
        request_number: 0,
        deliver_number: 0,
        layout: "./layout/loginLayout.ejs",
      });
    } catch (err) {
      logger.log("error", `admin-controller _ logout() : ${err}`);
    }
  }

  static async change_password(req, res) {
    try {
      const { method } = req;
      if (method == "GET") {
        res.render("change-password", { layout: "./layout/loginLayout.ejs" });
      } else {
        var loginedUser = await req.user;
        var user = await req.models.User.findByPk(loginedUser.id);
        var isMatch = await bcrypt.compare(req.body.old_pass, user.password);
        if (isMatch) {
          var new_password = await bcrypt.hash(req.body.new_pass, 10);
          user.password = new_password;
          user.save();
          return res.json({
            success: true,
            message: "تغییر رمز با موفقیت انجام شد",
          });
        } else {
          return res.json({
            success: false,
            message: "رمز قبلی به درستی وارد نشده است",
          });
        }
      }
    } catch (err) {
      logger.log("error", `admin-controller _ change_password() : ${err}`);
      res.json({ success: false, message: "تغییر رمز انجام نشد" });
    }
  }
}
