const DEVICE_MODEL_LIST = [
  "iPhone16,2", "iPhone16,1", "iPhone14,2", "iPhone14,1", "iPhone13,4", "iPhone13,3", "iPhone13,2",
  "iPhone13,1", "iPhone12,8", "iPhone12,5", "iPhone12,3", "iPhone12,1", "iPhone11,8", "iPhone11,6",
  "iPhone11,4", "iPhone11,2", "iPhone10,6", "iPhone10,5", "iPhone10,4", "iPhone10,3", "iPhone10,2",
  "iPhone10,1", "iPad8,8", "iPad8,7", "iPad8,6", "iPad8,5", "iPad8,4", "iPad8,3", "iPad8,2",
  "iPad8,1", "iPad7,6", "iPad7,5", "iPad7,4", "iPad7,3", "iPad7,2", "iPad7,1", "iPad6,12",
  "iPad6,11", "iPad5,4", "iPad5,3", "iPad5,2", "iPad5,1",
]

export const getLuckyDevice = () => {
  const randomIndex = Math.floor(Math.random() * DEVICE_MODEL_LIST.length)
  return DEVICE_MODEL_LIST[randomIndex]
}

