import zhongguo from "@/resources/json/ch_areaData.json";
import beijing from "@/resources/json/beijing.json";
import anhui from "@/resources/json/anhui.json";
import chongqing from "@/resources/json/chongqing.json";
import fujian from "@/resources/json/fujian.json";
import gansu from "@/resources/json/gansu.json";
import gangdong from "@/resources/json/guangdong.json";
import guangxi from "@/resources/json/guangxi.json";
import guizhou from "@/resources/json/guizhou.json";
import hainan from "@/resources/json/hainan.json";
import aomen from "@/resources/json/haomeng.json";
import hebei from "@/resources/json/hebei.json";
import heilongjiang from "@/resources/json/heilongjiang.json";
import helan from "@/resources/json/helan.json";
import hubei from "@/resources/json/hubei.json";
import hunan from "@/resources/json/hunan.json";
import jiangsu from "@/resources/json/jiangsu.json";
import jiangxi from "@/resources/json/jiangxi.json";
import jiling from "@/resources/json/jiling.json";
import liaoning from "@/resources/json/liaoning.json";
import neimonggu from "@/resources/json/neimonggu.json";
import ningxia from "@/resources/json/ningxia.json";
import qinghai from "@/resources/json/qinghai.json";
import shandong from "@/resources/json/shandong.json";
import shanxi from "@/resources/json/shanxi.json";
import shanxi2 from "@/resources/json/shanxi2.json";
import sichuan from "@/resources/json/sichuan.json";
import taiwan from "@/resources/json/taiwan.json";
import tianjin from "@/resources/json/tianjin.json";
import xianggang from "@/resources/json/xianggang.json";
import xingjiang from "@/resources/json/xingjiang.json";
import xizang from "@/resources/json/xizang.json";
import yunnan from "@/resources/json/yunnan.json";
import zhejiang from "@/resources/json/zhejiang.json";
import shanghai from "@/resources/json/shanghai.json";

// ...

const mapDict = {
  "北京": "beijing",
  "安徽": "anhui",
  "重庆": "chongqing",
  "福建": "fujian",
  "甘肃": "gansu",
  "广东": "gangdong",
  "广西": "guangxi",
  "贵州": "guizhou",
  "海南": "hainan",
  "澳门": "aomen",
  "河北": "hebei",
  "黑龙江": "heilongjiang",
  "河南": "helan",
  "湖北": "hubei",
  "湖南": "hunan",
  "江苏": "jiangsu",
  "江西": "jiangxi",
  "吉林": "jiling",
  "辽宁": "liaoning",
  "内蒙古": "neimonggu",
  "宁夏": "ningxia",
  "青海": "qinghai",
  "山东": "shandong",
  "山西": "shanxi",
  "陕西": "shanxi2",
  "四川": "sichuan",
  "台湾": "taiwan",
  "天津": "tianjin",
  "香港": "xianggang",
  "新疆": "xingjiang",
  "西藏": "xizang",
  "云南": "yunnan",
  "浙江": "zhejiang",
  "上海": "shanghai"
};

const mapData = {
  zhongguo,
  beijing,
  anhui,
  chongqing,
  fujian,
  gansu,
  gangdong,
  guangxi,
  guizhou,
  hainan,
  aomen,
  hebei,
  heilongjiang,
  helan,
  hubei,
  hunan,
  jiangsu,
  jiangxi,
  jiling,
  liaoning,
  neimonggu,
  ningxia,
  qinghai,
  shandong,
  shanxi,
  shanxi2,
  sichuan,
  taiwan,
  tianjin,
  xianggang,
  xingjiang,
  xizang,
  yunnan,
  zhejiang,
  shanghai
};

export function getMap(mapName) {
  const cityName = mapDict[mapName];
  if (cityName) {
    return [cityName, mapData[cityName]]
  }
  return ['china', zhongguo]
}
