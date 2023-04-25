import { ElMessage } from 'element-plus'
export const copyTextToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage({
      message: '复制成功',
      type: 'success'
    })
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};