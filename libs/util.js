/**
 * Created by Ken.Cui on 2014/5/5.
 */

exports.format_date = function (date, format) {
    var dateStr = {};
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (format === 'bydays' || format === 'by7days') {
        dateStr.format = 'yyyy-mm-dd';
        dateStr.value = year + '-' + month + '-' + day;
    } else if (format === 'bymonth') {
        dateStr.format = 'yyyy-mm';
        dateStr.value = year + '-' + month;
    } else if (format === 'byyear') {
        dateStr.format = 'yyyy';
        dateStr.value = year;
    }
    return dateStr;
}