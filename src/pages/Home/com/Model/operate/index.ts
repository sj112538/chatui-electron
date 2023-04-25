export const select = ref<selectType>('session')

const selectMap = {
  session: () => {
    // FormStore().setFormName(nowModel.value?.type)
  },
  Model: () => {
    // FormStore().setFormName(nowModel.value?.type)
  },
  file: () => {
  },
  setting: () => { },
  'fine-tuning': () => {
    // FormStore().setFormName("openAi微调")
  },
  '': () => { }
}
type selectType = keyof typeof selectMap;

export const selectEvent = (type: selectType) => {
  selectMap[type]()
  if (select.value === type) {
    select.value = ''
  } else {
    select.value = type
  }
}
