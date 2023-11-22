
export function validate_date(date) {
    var regex = /^[0-9]{4}[\/][0-9]{2}[\/][0-9]{2}$/g;
    const isVAlid = regex.test(date);
    return isVAlid
}