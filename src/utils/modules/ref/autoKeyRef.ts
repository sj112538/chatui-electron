export const autoKeyRef = (initValue: any) => {
  return new Proxy(initValue, {
    get(target, key) {
      // 如果属性不存在，则创建一个包含该属性的ref对象
      if (!(key in target)) {
        target[key] = ref(null);
      }
      return target[key];
    },
  });
}