export const useGamePlay = () => {
  return { PlayName, PlayLists }
}
const PlayName = ref<PlayListMode>('默认模式')
const PlayLists: PlayList = [
  { modeName: '默认模式', status: true, info: '普通模式，只有对话的功能' },
  { modeName: '控制模式', status: true, info: '实现语言模型使用CMD控制电脑，实现类似个人助手的功能,该模式下的cmd命令直接操控你的操作系统' }
]
