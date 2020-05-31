import * as iconv from 'iconv-lite';


export function convertWin1251BufToUtf8(value: Buffer) {
  return iconv.decode(value, 'win1251');
}

export function convertWin1251BufToUri(value: Buffer) {
  return value.reduce((res, cur) => {
    let convertedChar;
    if (
      cur >= CYRIL_CHARS_FIRST && cur <= CYRIL_CHARS_LAST 
      || cur == CYRIL_YO_UPPERCASE 
      || cur == CYRIL_YO_LOWERCASE 
      || cur == CYRIL_NEW_LINE
    ) {
      convertedChar = `%${cur.toString(16).toUpperCase()}`
    } else if (cur == CYRIL_SPACE) {
      convertedChar = '+'
    } else {
      convertedChar = String.fromCharCode(cur)
    }
    res += convertedChar;
    return res;
  },'');
}

export function convertToUri(value: string): string {
  return convertWin1251BufToUri(convertUtf8ToWin1251Buf(value));
}

export function convertUtf8ToWin1251Buf(value: string): Buffer {
  return iconv.encode(value, 'win1251');
}

const CYRIL_CHARS_FIRST = 192;
const CYRIL_CHARS_LAST = 255;
const CYRIL_YO_UPPERCASE = 168;
const CYRIL_YO_LOWERCASE = 184;
const CYRIL_SPACE = 32;
const CYRIL_NEW_LINE = 10;