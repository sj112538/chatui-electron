export const fuzzyMatch = (str: string | any[], query: string | string[] | RegExp) => {
  let results = [];
  if (!Array.isArray(str)) {
    str = [str]
  }
  if (!Array.isArray(query)) {
    query = [query as unknown as string]
  }
  const regex: any[] = []
  query.forEach(e => {
    regex.push(new RegExp(e, 'i'))
  })
  for (let i = 0; i < str.length; i++) {
    if(!str[i]){
      continue
    }
    if (str[i].toString().indexOf(query) !== -1) { // 如果子字符串中包含要查找的字符串
      results.push(i);
    } else if (regex.some(e => e.test((str[i].toString())))) { // 如果字符串与正则表达式匹配
      results.push(i);
    }
  }
  return results;
}