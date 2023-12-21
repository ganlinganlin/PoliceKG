import React, { useState,useRef  } from 'react';
import RcResizeObserver from 'rc-resize-observer';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { Space, Button, Input, DatePicker,Table,Select  } from 'antd';
import { Pie,Bar } from '@ant-design/plots';
import './index.less';
// import mammoth from 'mammoth';

// import { Packer } from 'docxtemplater';
// import * as fs from 'fs';

import JSZipUtils from "jszip-utils";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import ImageModule from "docxtemplater"

import dayjs from "dayjs";
import HttpUtils from '@/utils/HttpUtils';
import ApiUtils from '@/utils/ApiUtils';
import chat_item from "../question/user/chat_item";
import {getCountEvents} from  '@/server/kg.js'

class Export extends React.Component {



  constructor(props) {
    super(props);
    console.log('Statistic');
    this.mybar = React.createRef()
    this.mybar2 = React.createRef()
    this.mybar1 = React.createRef()
    this.mypie = React.createRef()
    this.state = {
      responsive: true,
      all_events: {
        eventcount_events_weeks: '',
        eventdays_numbers: '',
        eventcount_events_day: '',
        eventcount_events_weeks1: '',
        eventdays_numbers1: '',
        eventcount_events_day1: '',
        eventcount_events_weeks2: '',
        eventdays_numbers2: '',
        eventcount_events_day2: '',
        eventhuanbi_change: "",
        eventhuanbi_rate: '',
        eventtongbi_change: "",
        eventtongbi_rate: ''
      },

      eventcount_events_weeks: '',
      eventdays_numbers: '',
      eventcount_events_day: '',
      eventcount_events_weeks1: '',
      eventdays_numbers1: '',
      eventcount_events_day1: '',
      eventcount_events_weeks2: '',
      eventdays_numbers2: '',
      eventcount_events_day2: '',

      eventhuanbi_change: "",
      eventhuanbi_rate: '',
      eventtongbi_change: "",
      eventtongbi_rate: '',

      cehuanbi_change: "",
      cehuanbi_rate: "",
      cetongbi_change: "",
      cetongbi_rate: '',

      aehuanbi_change: "",
      aehuanbi_rate: "",
      aetongbi_change: "",
      aetongbi_rate: '',

      tehuanbi_change: "",
      tehuanbi_rate: "",
      tetongbi_change: "",
      tetongbi_rate: '',

      weeks_data:[],
      events_sort:[],
      schedule_this_time :[],
      schedule_all_time :[],
      data_1:[],
      time : {
        start_time : '',
        end_time : '',
      },
      start_time1:'',
      end_time1:'',
    };
  }


  componentDidMount() {
    // console.log(this.myRef.current)
  }



// 点击查询
  SelectQuery = () => {

    // console.log()
    console.log("点击查询")
    const params =  {
    "start_time" : this.state.time['start_time'],
    "end_time" : this.state.time['end_time']
    }
    console.log(params)


    // # 本周警情综述
    HttpUtils.post(ApiUtils.API_GET_COUNT_EVENTS_FIGURE,params)
      .then((res)=>{
        console.log(res)
        console.log(res[0])


        this.setState(
          {
          weeks_data: res
          }

        )

    })
      .catch((error)=>{
        console.log('error: ' + error.message);
      })

    // # 全局有效警情分类情况
    HttpUtils.post(ApiUtils.API_GET_COUNT_EVENTS_SORT,params)
      .then((res)=>{
        console.log(res)
        console.log(res[0])


        this.setState(
          {
          events_sort: res
          }

        )

    })
      .catch((error)=>{
        console.log('error: ' + error.message);
      })

    // # 本时段各单位110接报警情一览表
    HttpUtils.post(ApiUtils.API_GET_SCHEDULE_THIS_TIME,params)
      .then((res)=>{
        console.log(res)
        console.log(res[0])


        this.setState(
          {
          schedule_this_time: res
          }

        )

    })
      .catch((error)=>{
        console.log('error: ' + error.message);
      })


    // # 2023年以来各单位110接报警情一览表
    HttpUtils.post(ApiUtils.API_GET_SCHEDULE_ALL_TIME,params)
      .then((res)=>{
        console.log(res)
        console.log(res[0])


        this.setState(
          {
          schedule_all_time: res
          }

        )

    })
      .catch((error)=>{
        console.log('error: ' + error.message);
      })


    // # 2023年以来时间
    HttpUtils.post(ApiUtils.API_GET_ALL_TIME,params)
      .then((res)=>{
        console.log(res)
        console.log(res['start_time1'])

        this.setState(
          {
            start_time1: res['start_time1'],
            end_time1: res['end_time1'],
          }
        )

    })
      .catch((error)=>{
        console.log('error: ' + error.message);
      })

  };


  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return u8arr
  }

// 导出Word文档的方法
  exportWordDocument = () => {
        console.log("点击导出")
        const params =  {
        "start_time" : this.state.time['start_time'],
        "end_time" : this.state.time['end_time']
        }
        console.log(params)

        // #word文档导出
        HttpUtils.post(ApiUtils.API_GET_COUNT_EVENTS,params)
          .then((res)=>{
            console.log(res)
            console.log(res[0])

            this.setState({
              eventcount_events_weeks : res[0]['eventcount_events_weeks'],
              eventcount_events_day :  res[0]['eventcount_events_day'],
              eventdays_numbers: res[0]['eventdays_numbers'],
              // eventcount_events_weeks1: res[0]['eventcount_events_day'],
              // eventdays_numbers1: res[0]['eventcount_events_day'],
              // eventcount_events_day1: res[0]['eventcount_events_day'],
              // eventcount_events_weeks2: res[0]['eventcount_events_day'],
              // eventdays_numbers2: res[0]['eventcount_events_day'],
              // eventcount_events_day2: res[0]['eventcount_events_day'],
              eventhuanbi_change: res[0]['eventhuanbi_change'],
              eventhuanbi_rate: res[0]['eventhuanbi_rate'],
              eventtongbi_change: res[0]['eventtongbi_change'],
              eventtongbi_rate: res[0]['eventtongbi_rate'],

              cehuanbi_change: res[1]['cehuanbi_change'],
              cehuanbi_rate: res[1]['cehuanbi_rate'],
              cetongbi_change: res[1]['cetongbi_change'],
              cetongbi_rate: res[1]['cetongbi_rate'],

              aehuanbi_change: res[2]['aehuanbi_change'],
              aehuanbi_rate: res[2]['aehuanbi_rate'],
              aetongbi_change: res[2]['aetongbi_change'],
              aetongbi_rate: res[2]['aetongbi_rate'],

              tehuanbi_change: res[3]['tehuanbi_change'],
              tehuanbi_rate: res[3]['tehuanbi_rate'],
              tetongbi_change: res[3]['tetongbi_change'],
              tetongbi_rate: res[3]['tetongbi_rate'],
            },
      () => {
                console.log('count1',res[0]['eventcount_events_weeks']);
                console.log('count2',res[0]['eventcount_events_day']);


                const content = '<w:t>每周警情通报</w:t>' +
                          '<w:r>（2023年第*期'+this.state.time['start_time']+'至'+this.state.time['end_time']+'）</w:r>' +
                          '<w:r>指挥室指挥调度科--------------------------------------'+this.state.time['end_time']+'</w:r>' +
                          '<w:r>本周警情综述</w:r>' +
                          '本时段，分局110共接警' + this.state.eventcount_events_weeks + '起，统计的天数为'+this.state.eventdays_numbers+'天，日均'+ this.state.eventcount_events_day +
                  '起，环比、同比分别'+this.state.eventhuanbi_change+this.state.eventhuanbi_rate+'和'+this.state.eventtongbi_change+this.state.eventtongbi_rate+'。'+
                  '其中，刑事警情环比'+this.state.cehuanbi_change+this.state.cehuanbi_rate+'、同比'+this.state.cetongbi_change+this.state.cetongbi_rate+
                  '；行政（治安）警情环比、同比分别'+this.state.aehuanbi_change+this.state.aehuanbi_rate+'和'+this.state.aetongbi_change+this.state.aetongbi_rate+
                  '；交通警情环比'+this.state.tehuanbi_change+this.state.tehuanbi_rate+'、同比'+this.state.tetongbi_change+this.state.tetongbi_rate+'。'
                ;
                // <w:p>为段落,<w:r>为运行元素的xml格式,<w:t>为文本元素

                const header = `<?xml version="1.0" encoding="UTF-8"?>
                      <w:wordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
                          <w:body>
                              ${content}
                          </w:body>
                      </w:wordDocument>`;

                const blob = new Blob([header], { type: 'application/msword' });
                // const blob = new Blob([header], { type: 'application/application/pdf' });

                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = '警情.doc';
                link.textContent = '点击下载警情.doc';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            )

        })
          .catch((error)=>{
            console.log('error: ' + error.message);
          })

        // // # 本周警情综述
        // HttpUtils.post(ApiUtils.API_GET_COUNT_EVENTS_FIGURE,params)
        //   .then((res)=>{
        //     console.log(res)
        //     console.log(res[0])
        //
        //
        //     this.setState(
        //       {
        //       weeks_data: res
        //       }
        //
        //     )
        //
        // })
        //   .catch((error)=>{
        //     console.log('error: ' + error.message);
        //   })
        //
        // // # 全局有效警情分类情况
        // HttpUtils.post(ApiUtils.API_GET_COUNT_EVENTS_SORT,params)
        //   .then((res)=>{
        //     console.log(res)
        //     console.log(res[0])
        //
        //
        //     this.setState(
        //       {
        //       events_sort: res
        //       }
        //
        //     )
        //
        // })
        //   .catch((error)=>{
        //     console.log('error: ' + error.message);
        //   })
        //
        // // # 本时段各单位110接报警情一览表
        // HttpUtils.post(ApiUtils.API_GET_SCHEDULE_THIS_TIME,params)
        //   .then((res)=>{
        //     console.log(res)
        //     console.log(res[0])
        //
        //
        //     this.setState(
        //       {
        //       schedule_this_time: res
        //       }
        //
        //     )
        //
        // })
        //   .catch((error)=>{
        //     console.log('error: ' + error.message);
        //   })
        //
        //
        // // # 2023年以来各单位110接报警情一览表
        // HttpUtils.post(ApiUtils.API_GET_SCHEDULE_ALL_TIME,params)
        //   .then((res)=>{
        //     console.log(res)
        //     console.log(res[0])
        //
        //
        //     this.setState(
        //       {
        //       schedule_all_time: res
        //       }
        //
        //     )
        //
        // })
        //   .catch((error)=>{
        //     console.log('error: ' + error.message);
        //   })
        //
        //
        // // # 2023年以来时间
        // HttpUtils.post(ApiUtils.API_GET_ALL_TIME,params)
        //   .then((res)=>{
        //     console.log(res)
        //     console.log(res['start_time1'])
        //
        //     this.setState(
        //       {
        //         start_time1: res['start_time1'],
        //         end_time1: res['end_time1'],
        //       }
        //     )
        //
        // })
        //   .catch((error)=>{
        //     console.log('error: ' + error.message);
        //   })


      };

  handleTime( data, dataString) {

    // console.log(value)
    let start = ''
    let end = ''
    if (data) {
      start = dataString[0]
      end = dataString[1]
    } else {
      console.log('Clear');
      start = ''
      end = ''
    }
    this.setState({
      time: {
        start_time: start,
        end_time: end,
      }
    })
  };

  async exportTest(){

    const params =  {
      "start_time" : this.state.time['start_time'],
      "end_time" : this.state.time['end_time']
    }
    const res = await getCountEvents(params)
    const p02 = {
      p02_change : '下降',
      p02_all_number : 22,
      p02_huanbi_change : '上升',
      p02_huanbi_number : 3,
      p02_jine : 1652236,
      p02_huanbi_change2 : '下降',
      p02_huanbi_number2 : 5,
      p02_10w_number : 3,
      p02_leixing_number : [
        {label: '诈骗', num: 8},
        {label: "电话", num: 9},
      ],
      p02_police : '西堤头所',
      p02_address : '西堤头村',
      p02_police_number : 2,
    }
    const p03 = {
      p03_change : '下降',
      p03_all_number : 22,
      p03_huanbi_change : '减少',
      p03_huanbi_number : 2,
      p03_leixing_number : [
        {police: '天穆所', num: 1, address: '蓝岸森林6号楼楼前', num2: 1},
        {police: '佳荣里所', num: 1, address: '佳宁里5号楼楼下', num2: 1},
        {police: '青源所', num: 1, address: '双青新家园荣诚园小区门口', num2: 1},
        {police: '西堤头所', num: 1, address: '东赵庄村天赐园', num2: 1},
        {police: '集贤里所', num: 1, address: '富锦华庭3号楼下', num2: 1},
      ]
    }
    const p04 = {
      p04_huanbi_change : '上升',
      p04_huanbi_number : '4%',
      p04_tongbi_change : '下降',
      p04_tongbi_number : '44%',
      p04_tongbi_up : [
        {police: '交警西堤头大队', rate: '67%'},
        {police: '普东所', rate: '56%'},
        {police: '瑞景所', rate: '15%'},
      ],
      p04_tongbi_down : [
        {police: '交警双口大队', rate: '100%'},
        {police: '交警宜白路大队', rate: '100%'},
        {police: '果园新村所', rate: '81%'},
      ],
      p04_tongbi_up2 : [
        {police: '交警双口大队', rate: '16%'},
        {police: '交警宜白路大队', rate: '12%'},
      ],
      p04_tongbi_down2 : [
        {police: '果园新村所', rate: '49%'},
      ],
    }
    const p05 = {
      p05_huanbi_change : '上升',
      p05_tongbi_change : '下降',
      p05_huanbi_change2 : '上升',
      p05_tongbi_change2 : '下降',
      p05_up : [
        {label: '交通类警情', rate: '28%'},
        {label: '求助类警情', rate: '38%'},
      ],
    }
    const p06 = {
      p06_leixing_number : [
        {police: '天穆所', num: '384'},
        {police: '宜兴埠所', num: '362'},
        {police: '普东所', num: '360'},
      ],
      p06_huanbi_up : [
        {police: '双口所', rate: '28%'},
        {police: '普东所', rate: '23%'},
        {police: '西堤头所', rate: '22%'},
      ],
    }
    const p07 = {
      p07_10_up : 192,
      p07_number_phone : 10,
      p07_leixing_phone : [
        {police: '交警引河桥大队', person: '张三', phone: '1850225', number: 52, content: '内容1',  check: 'check1', feedback: 'back1'},
        {police: '引河桥大队', person: '李四', phone: '01781328', number: 22, content: '内容2',  check: 'check2', feedback: 'back2'},
      ],
    }
    const p08 = {
      p08_leixing_number : [
        {police: '交警引河桥大队', num: 697},
        {police: '交警双口大队', num: 638},
        {police: '交警宜白路大队', num: 515},
        {police: '交警西堤头大队', num: 150},
      ],
    }
    const p09 = {
      p09_number_change: '下降',
      p09_number: 9,
      p09_huanbi_change: '下降',
      p09_leixing_number : [
        {label: '意外死亡', num: 5},
        {label: '自杀死亡', num: 2},
        {label: '疾病死亡', num: 2},
      ],
    }
    const p092 = {
      p092_number_change: '下降',
      p092_number: '未接报',
      p09_huanbi_change: '下降',
      p09_leixing_number : [
        {label: '意外死亡', num: 5},
        {label: '自杀死亡', num: 2},
        {label: '疾病死亡', num: 2},
      ],
    }
    const p093 = {
      p093_number_change: '上升',
      p093_number: 491,
      p093_huanbi_change: '增加',
      p093_huanbi_number: 21,
      p093_leixing_number : [
        {label: '婚恋家庭纠纷'},
        {label: '经济纠纷'},
        {label: '消费维权产品质量'},
        {label: '邻里关系纠纷'},

      ],
    }
    const p094 = {
      p094_number_change: '下降',
      p094_number: 8,
      p094_huanbi_change: '下降',
      p094_leixing_number : [
        {address: '大学', num: 7, label: [{name:'通信网络诈骗' , num2: 2},{name:'殴打他人', num2: 2},{name:'敲诈勒索', num2: 1},{name:'故意损毁财物', num2: 1},{name:'盗窃', num2: 1}] },
        {address: '小学', num: 1, label: [{name:'殴打他人', num2: 1}]},
      ],
    }
    const p095 = {
      p095_number: 3,
      p095_leixing_number : [
        {police: '北仓所', num: 2, person: [{name:'张三' , phone: '111111'},{name:'李四', phone: '222222'}] },
        {police: '双口所', num: 1, person: [{name:'王五' , phone: '333333'}] },
      ],

    }
    const p101 = {
      p101_number_change: '下降',
      p101_number: '未接报',
      p101_huanbi_change: '',
      p101_leixing_number : [],
    }
    const p102 = {
      p102_number_change: '上升',
      p102_number: 77,
      p102_huanbi_change: '上升',
      p102_number_avg: 11,
      p102_leixing_number : [
        {police: '双口所', num: 15},
        {police: '西堤头所', num: 11},
        {police: '宜兴埠所', num: 9},
      ],
      p102_leixing_number_up : [
        {police: '双口所', num: 15, num2: 10},
        {police: '小淀所', num: 8, num2: 6},
      ],

    }
    const p103 = {
      p103_number_change: '下降',
      p103_number: 28,
      p103_huanbi_change: '减少',
      p103_huanbi_number: 3,
      p103_leixing_number : [
        {police: '小淀所', num: 4},
        {police: '西堤头所', num: 4},
        {police: '天穆所', num: 4},
      ],
      p103_leixing_number_up : [
        {police: '天穆所', num: 4, num2: 4},
        {police: '西堤头所', num: 4, num2: 2},
      ],

    }
    const p104 = {
      p104_number_change: '下降',
      p104_number: 29,
      p104_huanbi_change: '减少',
      p104_huanbi_number: 3,
      p104_leixing_number : [
        {leixing: '赌博警情', num: 11, huanbi_change: '减少', huanbi_number: 4, police: '宜兴埠所', num2: 5, label: [{address:'高新大道' , num3: 2},{address:'宜淞园', num3: 2},{address:'三千路', num3: 1}] },
        {leixing: '卖淫嫖娼警情', num: 18, huanbi_change: '增加', huanbi_number: 1,  police: '西堤头所', num2: 8, label: [{address:'西堤头村' , num3: 8}] },
      ],
    }
    const p105 = {
      p105_number_change: '上升',
      p105_number: 101,
      p105_huanbi_change: '上升',
      p105_number_avg: 14,
      p105_number2: 101,
      p105_event_number : [
        {event: '行政（治安）案件', num: 101, label: [{event2:'调解' , num2: 61}] },
      ],
      p105_address_number : [
        {address: '居民小区', num: 26 },
        {address: '街头道路', num: 21 },
        {address: '商业场所', num: 16 },
        {address: '企事业单位', num: 8 },
        {address: '城郊结合部', num: 6 },
        {address: '行政村居', num: 5 },
        {address: '公共场合', num: 5 },
        {address: '建筑工地工棚', num: 5 },
      ],
      p105_reason_number : [
        {reason: '感情纠纷'},
        {reason: '工作纠纷'},
        {reason: '酒后口角'},

      ],
    }
    const p106 = {
      p106_number_change: '上升',
      p106_number: 1098,
      p106_huanbi_change: '上升',
      p106_huanbi_number: '1%',
      p106_leixing_number : [
        {police: '引河桥大队', label: [{address:'京津公路双街路段' , num: 51},{address:'北仓路段', num: 27},{address:'北辰道段', num: 24}] },
        {police: '双口大队', label: [{address:'韩家墅菜市场' , num: 26} ] },
        {police: '宜白路大队', label: [{address:'津围公路大张庄路段' , num: 42},{address:'小淀路段', num: 8}] },
      ],
      p106_dead_number: 0
    }

    const t01 ={
      table01 : [
          { label: '违法犯罪', small: '刑事', number_1:105, huanbi_1:'2%', tongbi_1:'-2%', day_avg:2},
          { label: '违法犯罪', small: '治安', number_1:605, huanbi_1:'2%', tongbi_1:'2%', day_avg:1},
          { label: '交通', small: '交通警情', number_1:705, huanbi_1:'2%', tongbi_1:'2%', day_avg:2},
          { label: '交通', small: '交通事故', number_1:65, huanbi_1:'2%', tongbi_1:'2%', day_avg:2},
          { label: '交通', small: '交通堵塞', number_1:76, huanbi_1:'2%', tongbi_1:'2%', day_avg:1},
          { label: '社会纠纷', small: '社会纠纷', number_1:17, huanbi_1:'2%', tongbi_1:'2%', day_avg:2},
          { label: '群众求助', small: '群众求助', number_1:176, huanbi_1:'2%', tongbi_1:'2%', day_avg:12},
          { label: '举报违法犯罪', small: '举报违法犯罪', number_1:160, huanbi_1:'2%', tongbi_1:'2%', day_avg:2},
          { label: '重复警情', small: '重复警情', number_1:175, huanbi_1:'2%', tongbi_1:'2%', day_avg:12},
      ],
      table02_all : [
          {number_1:17605, huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
      ]
    }
    const t02 ={
      table02 : [
          { name: "01", police: '宜兴埠所', number_1:17605, huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "02", police: '普东所', number_1:'16889', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "03", police: '双街所', number_1:'12025', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "04", police: '小淀所', number_1:'11807', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "05", police: '瑞景所', number_1:'11336', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "06", police: '果园新村所', number_1:'10853', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "07", police: '果园新村所', number_1:'10853', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "08", police: '果园新村所', number_1:'10853', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "09", police: '果园新村所', number_1:'10853', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "17", police: '交警双口大队', number_1:27467, huanbi_1:'6%', tongbi_1:'13%', number_5:79, huanbi_5:'193%', tongbi_5:'-100%', },
          { name: "18", police: '果园新村所', number_1:10853, huanbi_1:'-16%', tongbi_1:'16%', number_2:0, huanbi_2:'-', tongbi_2:'-',number_3:0, huanbi_3:'-', tongbi_3:'-',number_4:0, huanbi_4:'-', tongbi_4:'-', number_5:0, huanbi_5:'持平', tongbi_5:'-26%', },
      ],
      table02_all : [
          {number_1:17605, huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
      ]
    }
    const t03 ={
      table03 : [
          { name: "01", police: '宜兴埠所', number_1:17605, huanbi_1:16656, tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "02", police: '普东所', number_1:'16889', huanbi_1:16656, tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "03", police: '双街所', number_1:'12025', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "04", police: '小淀所', number_1:'11807', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "05", police: '瑞景所', number_1:'11336', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "06", police: '果园新村所', number_1:'10853', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "07", police: '果园新村所', number_1:'10853', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "08", police: '果园新村所', number_1:'10853', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "09", police: '果园新村所', number_1:'10853', huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
          { name: "17", police: '交警双口大队', number_1:27467, huanbi_1:'6%', tongbi_1:'13%', number_5:79, huanbi_5:'193%', tongbi_5:'-100%', },
          { name: "18", police: '果园新村所', number_1:10853, huanbi_1:'-16%', tongbi_1:'16%', number_2:0, huanbi_2:'-', tongbi_2:'-',number_3:0, huanbi_3:'-', tongbi_3:'-',number_4:0, huanbi_4:'-', tongbi_4:'-', number_5:0, huanbi_5:'持平', tongbi_5:'-26%', },
      ],
      table03_all : [
          {number_1:17605, huanbi_1:'2%', tongbi_1:'2%', number_2:'122', huanbi_2:'2%', tongbi_2:'1%',number_3:'21', huanbi_3:'6%', tongbi_3:'4%',number_4:'23', huanbi_4:'3%', tongbi_4:'11%',number_5:'5', huanbi_5:'2%', tongbi_5:'2%', },
      ]
    }



    const merged_test = { ...res, ...p02, ...p03, ...p04, ...p05, ...p06, ...p07, ...p08,
      ...p09, ...p092, ...p093, ...p094, ...p095, ...p101, ...p102, ...p103, ...p104, ...p105, ...p106,
      ...t01, ...t02, ...t03};

    this.exportdocx(merged_test)
  }

  exportdocx(data){
    JSZipUtils.getBinaryContent(
      'templete.docx',
      function (error, content) {
        // 抛出异常
        if (error) {
          throw error;
        }
        console.log('全部数据：', data)
        // 创建一个PizZip实例，内容为模板的内容
        let zip = new PizZip(content);
        // 创建并加载docxtemplater实例对象
        let doc = new Docxtemplater().loadZip(zip);
        // 去除未定义值所显示的undefined
        doc.setOptions({
          nullGetter: function () {
            return "";
          }
        }); // 设置角度解析器

        doc.setData(data);


        try {
            // 用模板变量的值替换所有模板变量
            doc.render();
        } catch (error) {
            // 抛出异常
            let e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            };
            console.log(JSON.stringify({ error: e }));
            throw error;
        }
        // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
        let out = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        // 将目标文件对象保存为目标类型的文件，并命名
        saveAs(out, '每周警情通报.docx');
      })
  }

  render() {
    // 日期选择框
    const { RangePicker } = DatePicker;
    const rangePresets = [
      {
        label: 'Last 7 Days',
        value: [dayjs().add(-7, 'd'), dayjs()],
      },
      {
        label: 'Last 14 Days',
        value: [dayjs().add(-14, 'd'), dayjs()],
      },
      {
        label: 'Last 30 Days',
        value: [dayjs().add(-30, 'd'), dayjs()],
      },
      {
        label: 'Last 90 Days',
        value: [dayjs().add(-90, 'd'), dayjs()],
      },
    ];

    const DemoPie = () => {
      const data = this.state.events_sort;
      const config = {

        forceFit: true,
        title: {
          visible: true,
          text: '饼图-图形标签蜘蛛布局',
        },
        description: {
          visible: true,
          text:
            '当把饼图label的类型设置为spider时\uFF0C标签分为两组\uFF0C在图表两侧拉线对齐显示\u3002一般来说\uFF0C蜘蛛布局的label更不容易相互遮挡\u3002',
        },
        radius: 0.8,
        height: 440,
        width: 720,
        data,
        angleField: 'value',
        colorField: 'type',
        label: {
          type: 'outer',
          content: '{name} {percentage}',
        },
        interactions: [
          {
            type: 'pie-legend-active',
          },
          {
            type: 'element-active',
          },
        ],
      };
      return <Pie {...config} chartRef={this.mypie}/>;
    };

    const DemoBar = () => {
      const data = this.state.schedule_this_time;
      const config = {
        data: data.reverse(),
        height: 420,
        width: 720,
        isStack: true,
        xField: 'value',
        yField: 'key',
        seriesField: 'type',
        label: {
          // 可手动配置 label 数据标签位置
          position: 'middle',
          // 'left', 'middle', 'right'
          // 可配置附加的布局方法
          layout: [
            // 柱形图数据标签位置自动调整
            {
              type: 'interval-adjust-position',
            }, // 数据标签防遮挡
            {
              type: 'interval-hide-overlap',
            }, // 数据标签文颜色自动调整
            {
              type: 'adjust-color',
            },
          ],
        },
      };
      return <Bar {...config} chartRef={this.mybar} />;
    };

    const DemoBar1 = () => {
      const data = this.state.schedule_all_time;
      const config = {
        data: data.reverse(),
        height: 420,
        width: 720,
        isStack: true,
        xField: 'value',
        yField: 'key',
        seriesField: 'type',
        label: {
          // 可手动配置 label 数据标签位置
          position: 'middle',
          // 'left', 'middle', 'right'
          // 可配置附加的布局方法
          layout: [
            // 柱形图数据标签位置自动调整
            {
              type: 'interval-adjust-position',
            }, // 数据标签防遮挡
            {
              type: 'interval-hide-overlap',
            }, // 数据标签文颜色自动调整
            {
              type: 'adjust-color',
            },
          ],
        },
      };
      return <Bar {...config} chartRef={this.mybar1}/>;
    };


    const DemoBar2 = () => {

      const data = this.state.weeks_data;
      const config = {
        data,
        height: 440,
        width: 720,
        isGroup: true,
        xField: 'value',
        yField: 'label',
        seriesField: 'type',
        dodgePadding: 4,
        intervalPadding: 20,
        label: {
          // 可手动配置 label 数据标签位置
          position: 'middle',
          // 'left', 'middle', 'right'
          // 可配置附加的布局方法
          layout: [
            // 柱形图数据标签位置自动调整
            {
              type: 'interval-adjust-position',
            }, // 数据标签防遮挡
            {
              type: 'interval-hide-overlap',
            }, // 数据标签文颜色自动调整
            {
              type: 'adjust-color',
            },
          ],
        },
      };
      return <Bar {...config} chartRef = {this.mybar2}/>;
    };


    const handleExportImage = () => {
      const pieChart = pieRef.current;
      const barChart = barRef.current;

      if (pieChart && barChart) {
        // 获取 Pie 图表的图片数据
        const pieImageData = pieChart.getCanvas().toDataURL('image/png');

        // 获取 Bar 图表的图片数据
        const barImageData = barChart.getCanvas().toDataURL('image/png');

        // 创建一个新的窗口以显示导出的图片
        const exportWindow = window.open('');

        // 在新窗口中显示导出的 Pie 图表图片
        exportWindow.document.write('<div><h2>Pie Chart</h2><img src="' + pieImageData + '" alt="exported pie chart"/></div>');

        // 在新窗口中显示导出的 Bar 图表图片
        exportWindow.document.write('<div><h2>Bar Chart</h2><img src="' + barImageData + '" alt="exported bar chart"/></div>');
      }
    };

    const pieData = [
      { type: '分类一', value: 27 },
      { type: '分类二', value: 25 },
      // ... your pie data
    ];

    const barData = [
      { type: '分类一', value: 30 },
      { type: '分类二', value: 40 },
      // ... your bar data
    ];

    const pieConfig = {
      data: pieData,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      label: { type: 'outer' },
      interactions: [{ type: 'element-active' }],
      legend: { position: 'right-top' },
    };

    const barConfig = {
      data: barData,
      xField: 'type',
      yField: 'value',
      label: {},
      legend: { position: 'top' },
    };

    return (
      <RcResizeObserver
        key="resize-observer"
      >
        <div  className="KG_container">
            <ProCard title="事件统计" bordered gutter={8}>
                  <ProCard bordered colSpan="40%" >
                      <RangePicker  presets={rangePresets} onChange={ (data, dataString)  => this.handleTime( data, dataString)} />
                  </ProCard>
                  <ProCard bordered colSpan="30%"  >
                      <Button
                          type="primary"
                          onClick={this.SelectQuery}>
                       点击查询
                      </Button>
                  </ProCard>
                  <ProCard bordered colSpan="30%"  >
                      <Button
                          type="primary"
                          // onClick={this.exportWordDocument}
                        onClick={this.exportTest.bind(this)}
                      >
                       每周警情通报文档导出
                      </Button>

                  </ProCard>
            </ProCard>
            <ProCard
                split={this.state.responsive ? 'horizontal' : 'vertical'}
                gutter={[8, { xs: 8, sm: 16, md: 24, lg: 32 }]}
                ghost
              >
                  <ProCard className="statistic" gutter={8} ghost>
                      <ProCard
                            colSpan="50%"
                            layout="center"
                            title={"本周警情综述（"+this.state.time.start_time+"至"+this.state.time.end_time+"）"}
                          >
                        <DemoBar2/>

                          {/*<Pie {...pieConfig} onGetG2Instance={(chart) => (pieRef.current = chart)} />*/}
                          {/*<Bar {...barConfig} onGetG2Instance={(chart) => (barRef.current = chart)} />*/}
                          {/*<Button onClick={handleExportImage}>导出图片</Button>*/}

                        {/*<Button type="button" onClick={downloadImage} style={{ marginRight: 24 }}>*/}
                        {/*  导出图片*/}
                        {/*</Button>*/}
                      </ProCard>

                      <ProCard layout="center" title={"全局有效警情分类情况（"+this.state.time.start_time+"至"+this.state.time.end_time+"）"}>
                          <DemoPie />
                      </ProCard>
                  </ProCard>
                  <ProCard className="statistic" gutter={8} ghost>
                      <ProCard layout="center" title={"本时段各单位110接报警情一览表（"+this.state.time.start_time+"至"+this.state.time.end_time+"）"}>
                          <DemoBar />
                      </ProCard>
                      <ProCard layout="center" title={"2023年以来各单位110接报警情一览表（"+this.state.start_time1+"至"+this.state.end_time1+")"}>
                          <DemoBar1 />
                      </ProCard>
                  </ProCard>
            </ProCard>
        </div>



      </RcResizeObserver>
    );
  }


}


export default Export;