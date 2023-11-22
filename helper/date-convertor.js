import moment from "jalali-moment";

export function jalai_to_miladi(date) {
  return moment.from(date, "fa", "YYYY/MM/DD").format("YYYY-MM-DD");
}

export function miladi_to_jalali(date) {
  const converted_date = moment(date, 'YYYY/MM/DD').locale('fa').format('YYYY-MM-DD');
  return converted_date;
}