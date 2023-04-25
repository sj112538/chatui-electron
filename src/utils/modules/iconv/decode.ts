export let icDcode: any
try {
  const iconv = require('iconv-lite');
  const encoding = 'cp936';
  icDcode = (stdout: string) => {
    return iconv.decode(new Buffer(stdout, 'binary'), encoding)
  }
} catch (error) {

}
