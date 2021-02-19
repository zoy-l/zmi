export default function flatDeep(arr: any[], container: any[] = []) {
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      flatDeep(item, container)
    } else {
      container.push(item)
    }
  })
  return container
}
