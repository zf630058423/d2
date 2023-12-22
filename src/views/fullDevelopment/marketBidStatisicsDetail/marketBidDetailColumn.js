import { CLOSE_STATE_LIST, PROJECT_STATUS_LIST } from '../enum/index';

let sUnit = '(元)';   //元单位
let sTenUnit = '(万元)';    //万元单位
let sNumUnit = '(数量)';    //数量单位
let sPriceUnit = '(金额)';  //金额单位

//如果文字过长 设置列的宽度
function fnTiteWidth(title) {
  return Number(title.length) * 16 || 120;
}

export let marketBidDetailColumn = [
  {
    type: "seq",
    title: "序号",
    fixed: 'left',
    width: 35,
    align: "center",
  },
  {
    field: "itemNo",
    title: "立项编号",
    align: "left",
    fixed: 'left',
    width: 140,
    type: "html",
  },
  {
    field: "projectNo",
    title: "项目编号",
    align: "center",
    fixed: 'left',
    width: 140,
    type: "html",
  },
  {
    field: "contractNo",
    title: "合同编号",
    align: "center",
    width: 140,
    type: "html",
  },
  {
    field: "itemName",
    title: "项目名称",
    align: "center",
    width: 120,
    type: "html",
  },
  {
    field: "customer",
    title: `客户`,
    align: "center",
    width: 148,
    type: "html",
  },
  {
    field: "marketingCenter",
    title: "业务中心",
    align: "center",
    width: 148,
    // width: fnTiteWidth('本年累计营销立项数'),
    type: "html",
  },
  {
    field: "marketingUnit",
    title: `业务单元`,
    width: 120,
    align: "center",
    type: "html",
  },
  {
    field: "isPreContractor",
    title: "是否预选承包商",
    align: "center",
    width: fnTiteWidth('是否预选承包商'),
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '否',
          1: '是'
        }
        let text = textData[row.isPreContractor] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "follower",
    title: "跟进人",
    align: "center",
    type: "html",
  },
  {
    field: "projectLeader",
    title: "项目负责人",
    align: "center",
    type: "html",
  }, {
    field: "itemType",
    title: "立项类型",
    align: "center",
    type: "html",
  },
  {
    field: "productline",
    title: `产品线`,
    width: 140,
    align: "center",
    type: "html",
  },
  {
    field: "biddingForm",
    title: "招投标形式",
    align: "center",
    type: "html",
  },
  {
    field: "projectAddress",
    title: "项目地址(省-市)",
    width: fnTiteWidth('项目地址(省-市)'),
    align: "center",
    type: "html",
  },
  {
    field: "constructionCosts",
    title: `工程造价${sUnit}`,
    width: fnTiteWidth(`工程造价${sUnit}`),
    align: "center",
    type: "html",
  },
  {
    field: "estimatedBidAmount",
    title: `预估投标金额`,
    width: 120,
    align: "center",
    type: "html",
  },
  {
    field: "actualBidPrice",
    title: `实际投标报价${sUnit}`,
    width: 120,
    align: "center",
    type: "html",
  },
  {
    field: "singleBidAmount",
    title: `单标段投标金额${sUnit}`,
    width: fnTiteWidth(`单标段投标金额${sUnit}`),
    align: "center",
    type: "html",
  },
  {
    field: "licence",
    title: "建造师",
    align: "center",
    type: "html",
  },
  {
    field: "targetProfitRate",
    title: `投标利润率(%)`,
    width: fnTiteWidth(`投标利润率(%)`),
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let rate = row.targetProfitRate ? row.targetProfitRate * 100 + '%' : (row.targetProfitRate == 0 ? 0 : '');
        return (
          <span>{rate}</span>
        )
      },
    },
  },
  {
    field: "bidDeadline",
    title: "投标截止时间",
    width: 120,
    // width: fnTiteWidth(`投标截止时间`),
    align: "center",
    type: "html",
  },
  {
    field: 'itemStatus',
    title: `项目当前状态`,
    width: fnTiteWidth(`项目当前状态`),
    align: 'center',
    type: 'html',
    slots: {
      default: ({ row, column }, h) => {
        let itemData = PROJECT_STATUS_LIST.find(item => Number(item.id) === Number(row.itemStatus));
        let text = (row.itemStatus && itemData) ? PROJECT_STATUS_LIST.find(item => Number(item.id) === Number(row.itemStatus)).name : '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "closeState",
    title: `关闭状态`,
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let closeData = CLOSE_STATE_LIST.find(item => Number(item.id) === Number(row.closeState));
        let text = (row.closeState && closeData) ? CLOSE_STATE_LIST.find(item => Number(item.id) === Number(row.closeState)).name : '';
        return (
          <span>{text}</span>
        )
      }
    }
  },
  {
    field: "closeReason",
    title: "关闭原因",
    align: "center",
    width: 120,
    type: "html",
  },
  {
    field: "closeTime",
    title: "关闭时间",
    width: 120,
    align: "center",
    type: "html",
  },
  {
    field: "winTheBid",
    title: `是否中标`,
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '否',
          1: '是'
        }
        let text = textData[row.winTheBid] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "bidPrice",
    title: `中标价${sTenUnit}`,
    width: fnTiteWidth(`中标价${sTenUnit}`),
    align: "center",
    type: "html",
  },
  {
    field: "loseBidReason",
    title: `未中标原因分析`,
    width: fnTiteWidth(`未中标原因分析`),
    align: "center",
    type: "html",
  },
  {
    field: "finishedTimeItem",
    title: `营销立项/预选承包商入库流程审批通过时间`,
    width: fnTiteWidth(`营销立项/预选承包商入库流程审批通过时间`),
    align: "center",
    type: "html",
  },
  {
    field: "finishedTimePreBid",
    title: `标前评审流程审批结束时间`,
    width: fnTiteWidth(`标前评审流程审批结束时间`),
    align: "center",
    type: "html",
  },
  {
    field: "finishedTimeBid",
    title: "投标文件评审/资格预审文件评审流程审批通过时间",
    width: fnTiteWidth(`投标文件评审/资格预审文件评审流程审批通过时间`),
    align: "center",
    type: "html",
  },
  {
    field: "finishedTimeBidResult",
    title: `开标结果流程审批通过时间`,
    width: fnTiteWidth(`开标结果流程审批通过时间`),
    align: "center",
    type: "html",
  },
  {
    field: "isMakeAmendsFlowPath",
    title: "是否后补流程",
    // width: fnTiteWidth(`是否后补流程`),
    width: 120,
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '否',
          1: '是'
        }
        let text = textData[row.isMakeAmendsFlowPath] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "currentProcess",
    title: `当前流程`,
    // width: fnTiteWidth(`当前流程`),
    align: "center",
    width: 130,
    type: "html",
  },
  {
    field: "currentProcInstState",
    title: "单据状态",
    width: 130,
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let spanStyle = `font-size:12px;line-height:1.15;height:20px;padding: 0.3em 0.6em 0.3em;border-radius:0.15em;color:#fff;`;

        let statusData = {
          1: '草稿',
          2: '审批中',
          3: '已完成',
          5: '驳回申请人',
          99: '已作废'
        }
        let statusStyle = {
          1: 'label-grey',
          2: 'label-success',
          3: 'label-info',
          5: 'label-danger',
          99: 'label-grey'
        }
        let iData = {
          1: 'fa-file-text-o',
          2: 'fa-random',
          3: 'fa-stop-circle',
          5: '',
          99: 'fa-trash'
        }
        let iClassStyle = `fa bigger-120 ${iData[row.currentProcInstState]}`;

        let classStyle = `label ${statusStyle[row.currentProcInstState]}`;

        return (
          <span style={spanStyle} class={classStyle}>
            <i class={iClassStyle}></i>
            {statusData[row.currentProcInstState]}
          </span>
        )
      }
    }
  },
  {
    field: "preBidResult",
    title: `标前评审结果`,
    width: 120,
    // width: fnTiteWidth(`标前评审结果`),
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '不同意投标',
          1: '同意投标'
        }
        let text = textData[row.preBidResult] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "qualificateResult",
    title: "资格预审文件评审结果",
    width: fnTiteWidth(`资格预审文件评审结果`),
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '不同意投标',
          1: '同意投标'
        }
        let text = textData[row.qualificateResult] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  },
  {
    field: "bidResult",
    title: `投标文件评审评审结果`,
    width: fnTiteWidth(`投标文件评审评审结果`),
    align: "center",
    type: "html",
    slots: {
      default: ({ row, column }, h) => {
        let textData = {
          0: '不同意投标',
          1: '同意投标'
        }
        let text = textData[row.bidResult] || '';
        return (
          <span>{text}</span>
        )
      },
    },
  }
]

/**
 * 获取当前的开始时间
 * @param {*} dateTime 
 * @returns 
 */
export function getStartDateTime(dateTime) {
  return (dateTime && dateTime.length > 0) ? dateTime[0] : '';
}

/**
 * 获取当前的结束时间
 * @param {*} dateTime 
 * @returns 
 */
export function getEndDateTime(dateTime) {
  return (dateTime && dateTime.length > 0) ? dateTime[1] : '';
}