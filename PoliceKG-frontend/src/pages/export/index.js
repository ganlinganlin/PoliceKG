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

  exportTest= () => {
     const params =  {
        "start_time" : this.state.time['start_time'],
        "end_time" : this.state.time['end_time']
     }

     HttpUtils.post(ApiUtils.API_GET_COUNT_EVENTS,params)
       .then((res)=>{
         console.log('res: ', res)
         console.log(res[0])
         JSZipUtils.getBinaryContent(
           'templete.docx',
           function (error, content) {

            // 抛出异常
            if (error) {
                throw error;
            }
            /*
            function base64DataURLToArrayBuffer(dataURL) {
              console.log(dataURL);
              const base64Regex = /^data:image\/(png|jpg|svg|jpeg|svg\+xml);base64,/;
              if (!base64Regex.test(dataURL)) {
                return false;
              }
              const stringBase64 = dataURL.replace(base64Regex, "");
              let binaryString;
              if (typeof window !== "undefined") {
                binaryString = window.atob(stringBase64);
              } else {
                binaryString = new Buffer(stringBase64, "base64").toString("binary");
              }
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                const ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
              }
              return bytes.buffer;
            }
            let opts = {}
            opts.centered = false; //Set to true to always center images
            opts.fileType = "docx"; //Or pptx
            opts.getImage = base64DataURLToArrayBuffer(this.mybar.current?.toDataURL())
            //Pass the function that return image size
            opts.getSize = function () {
              return [450, 450];
            }
            let imageModule = new ImageModule(opts);
            */


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
            // 设置模板变量的值，对象的键需要和模板上的变量名一致，值就是你要放在模板上的值
            const params = {
                start_time: res[4]['start_time'],
                end_time: res[4]['end_time'],
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
              }

            doc.setData(params);

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
                mimeType:
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            // 将目标文件对象保存为目标类型的文件，并命名
            saveAs(out, '每周警情通报.docx');
          }
          ).bind(this);
       })
       .catch((error)=>{
         console.log('error: ' + error.message);
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


      // const ref = useRef();
        // 导出图片
      // const downloadImage = () => {
      //   ref.current?.downloadImage();
      // };

      // 获取图表 base64 数据
      // const toDataURL = () => {
      //   console.log(ref.current?.toDataURL());
      // };


      // const pieRef = useRef(null);
      // const barRef = useRef(null);

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
                        onClick={this.exportTest}
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