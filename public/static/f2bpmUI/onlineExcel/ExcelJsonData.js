//Excel 标准的Json数据格式：
data =
{
    "!sheetName": "",//sheet名称
    "!ref": "A1:L19",
    "A1": {
        "t": "s",//数据类型
        "v": "aa",//值
        "s": {
            font: { name: '宋体', sz: 20, color: { rgb: "FF0000" }, bold: false, italic: false, underline: false, strike: "删除线"+false }
            , border: { top: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } } }
            , alignment: { horizontal: "left", vertical: "center" }
            , fill: { "fgColor": { "rgb": "9bbb59" } }
        }
    }
   , "!merges": [
            { "s": { "c": 0, "r": 10 }, "e": { "c": 11, "r": 11 } }
   ],
   "!widthHeight":{ 
        "rowHeight": { "1": 50, "2": 50 }, "colWidth": {"1":65,"2":23}  
    }
}