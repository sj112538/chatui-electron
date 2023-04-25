export function highlightString(str: string, target: string | RegExp) {
  var regex = new RegExp(target, "i"); //去掉"g"（global）标志，匹配第一个结果
  var newStr = str.replace(regex, "<span class='highlightText'>" + target + "</span>");
  return newStr;
}

export function cancelHighlightString(str: string) {
  var regex = /<span class='highlightText'>(.*?)<\/span>/i; //去掉"g"（global）标志
  var newStr = str.replace(regex, "$1");
  return newStr;
}