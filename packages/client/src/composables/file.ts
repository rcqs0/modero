import { shallowRef } from 'vue'
// import { saveAs } from 'file-saver'

// TODO: use saveAs from 'file-saver' as fallback on browsers that don't support File System API

export default function useFile(
  types: FilePickerOptions['types'],
  load: (data: string, info: File) => void,
  props?: { transform?: (data: any, info: File) => any },
) {
  const handle = shallowRef<FileSystemFileHandle>()
  const info = shallowRef<File>()

  const reader = new FileReader()
  reader.onload = () => {
    if (!info.value) return

    load(reader.result as string, info.value)
  }

  async function write(data: any) {
    if (!handle.value || !info.value) return

    const writable = await handle.value.createWritable()
    await writable.write(
      props?.transform ? props.transform(data, info.value) : data,
    )
    await writable.close()
  }

  function read() {
    if (!info.value) return

    reader.readAsBinaryString(info.value)
  }

  async function saveAs(data: any, name?: string) {
    try {
      handle.value = await window.showSaveFilePicker({
        suggestedName: name,
        types,
        excludeAcceptAllOption: false,
      })
    } catch {
      return
    }

    info.value = await handle.value.getFile()
    write(data)

    return handle.value
  }

  async function save(data: any, name?: string) {
    if (!handle.value) {
      return saveAs(data, name)
    }

    await write(data)
    return handle.value
  }

  async function open() {
    try {
      const handles = await window.showOpenFilePicker({
        types,
        excludeAcceptAllOption: false,
        multiple: false,
      })
      handle.value = handles[0]
    } catch {
      return
    }

    info.value = await handle.value.getFile()
    read()
    return handle.value
  }

  return { handle, info, write, read, saveAs, save, open }
}
