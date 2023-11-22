import * as yup from 'yup';


export const yup_user = yup.object().shape({
  name: yup.string().required("وارد کردن الزامی است").min(3,"نام حداقل باید 3 کاراکتر باشد").trim(),
  family: yup.string().required("وارد کردن نام خانوادگی الزامی است").min(3,"نام خانوادگی حداقل باید 3 کاراکتر باشد").trim(),
  personal_code: yup.string().required(" وارد کردن کد پرسنلی الزامی است").trim(),
});

export const yup_contractor = yup.object().shape({
  name:yup.string().required("وارد کردن نام قرارداد الزامی است").trim()
})

export const yup_warehouse = yup.object().shape({
    name:yup.string().required("وارد کردن نام انبار الزامی است").trim()
  })

  export const yup_building = yup.object().shape({
    name: yup.string().required("وارد کردن الزامی است").trim(),
    building_type: yup.string().required("وارد کردن نوع ساختمان الزامی است").min(3,"نام خانوادگی حداقل باید 3 کاراکتر باشد").trim(),
    usage_type: yup.string().required(" وارد کردن نوع کاربری ساختمان الزامی است").trim(),
    number_of_room: yup.number().positive("مقدار منفی برای تعداد اتاق قابل قبول نمی باشد").required("وارد کردن تعداد اتاق الزامی است"),
  });

  export const yup_good = yup.object().shape({
    name: yup.string().required("وارد کردن الزامی است").trim(),
    has_code: yup.string().required("مشخص کنید که محصول کد اموال دارد یا خیر").oneOf(["0","1"]).trim(),
    code: yup.string().required("کد وارد شده برای محصول مجاز نمی باشد").trim(),
    // status: yup.string().required("وضعیت محصول را انتخاب نمایید").oneOf(["سالم","اسقاط","تحت تعمیر"],"وضعیت محصول مجاز نمی باشد"),
  });

  export const yup_warehouse_good = yup.object().shape({
    number: yup.number().positive("تعداد منفی مجاز نمی باشد").required("تعداد کالا را وارد نمایید"),
  });

  export const yup_attach_building = yup.object().shape({
  });

  export const yup_building_good = yup.object().shape({
    room_name: yup.string().required("نام اتاق را انتخاب نمایید").trim(),
    code: yup.string().required("کد کالا را انتخاب نمایید").trim(),
    number: yup.number().positive("تعداد منفی مجاز نمی باشد").required(" تعداد کالا را وارد نمایید"),
    deliverer: yup.string().required("نام تحویل دهنده الزامی است").trim(),
    receiver: yup.string().required("نام تحویل گیرنده الزامی است").trim(),
    delivery_date: yup.string().required("تاریخ تحویل کالا را وارد نمایید").trim(),
  });

  export const yup_attach_user = yup.object().shape({
    room_name: yup.string().required("نام اتاق را انتخاب نمایید").trim(),
    // users_id: yup.string().required("نام پرسنل را از لیست انتخاب نمایید").trim(),
  });