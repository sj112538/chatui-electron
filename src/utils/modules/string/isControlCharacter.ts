export const isControlCharacter = (c: string) => {
  const code = c.charCodeAt(0);
  return (code >= 0x0000 && code <= 0x001f) || (code >= 0x007f && code <= 0x009f);
}