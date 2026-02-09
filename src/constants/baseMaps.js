/**
 * 常用底图瓦片地址（XYZ，支持 {x} {y} {z} 或 {z}/{x}/{y}）
 * 每项可含 thumbnail 缩略图地址，供控件展示
 */
export const DEFAULT_BASE_MAPS = [
  {
    id: 'gaode',
    name: '高德地图',
    url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    thumbnail: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=2&y=1&z=3',
    maxZoom: 18,
    minZoom: 3,
  },
  {
    id: 'gaode-satellite',
    name: '高德卫星',
    url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    thumbnail: 'https://webst01.is.autonavi.com/appmaptile?style=6&x=2&y=1&z=3',
    maxZoom: 18,
    minZoom: 3,
  },
  {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    thumbnail: 'https://tile.openstreetmap.org/3/5/2.png',
    maxZoom: 19,
    minZoom: 0,
  },
]
