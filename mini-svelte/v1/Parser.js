class Parser {
  constructor(raw) {
    this.raw = raw;
    this.index = 0;
  }
  current() {// 获取当前字符
    return this.raw[this.index];
  }
  skip() {// 跳过空格，同时更新index
    while(this.current() <= ' ') { // todo 解释原理
      this.index++;
    }
  }
  next(str) { // 判断接下来的是不是传的字符串，同时更新index
    if (this.raw.slice(this.index, this.index + str.length) === str) {
      this.index += str.length;
      return true;
    }
    return false;
  }
  readUntil(string) {// 截取从当前获取直到传递的字符为止
    let str = ''
    let char = '';
    char = this.current();
    while(char !== string) {
      if (this.index >= this.raw.length) {
        return str;
      }
      str += char;
      this.index++;
      char = this.current();
    }
    return str;
  }
  readUntilPattern(pattern) {// 截取从当前直到正则匹配的字符为止
    let str = '';
    let char = '';
    char = this.current();
    while(!pattern.test(char)) {
      if (this.index >= this.raw.length) {
        return str;
      }
      str += char;
      this.index++;
      char = this.current();
    }
    return str;
  }
}

module.exports = Parser;