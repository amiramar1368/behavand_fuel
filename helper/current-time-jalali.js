export function current_jalali() {
  const d = new Date();
  const date = d.toLocaleDateString("fa-ir");
  return date;
}
