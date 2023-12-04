import React, { useState } from 'react';
import RcResizeObserver from 'rc-resize-observer';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { Space, Button, Input, DatePicker,Table,Select  } from 'antd';
import { Pie,Bar } from '@ant-design/plots';
import './index.less';
import mammoth from 'mammoth';

import { Packer } from 'docxtemplater';
import * as fs from 'fs';
import Docxtemplater from 'docxtemplater';
import KGContent from "../kg/kg_content";
import dayjs from "dayjs";
import HttpUtils from '@/utils/HttpUtils';
import ApiUtils from '@/utils/ApiUtils';

class Export extends React.Component {

  constructor(props) {
    super(props);
    console.log('Statistic');
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

      time : {
        start_time : '',
        end_time : '',
      },
    };
  }



// 导出Word文档的方法
      exportEmptyWordDocument = () => {
        console.log("点击导出")
        const params =  {
        "start_time" : this.state.time['start_time'],
        "end_time" : this.state.time['end_time']
        }
        console.log(params)


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

      };

      handleTime( data, dataString)
        {
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
        }

    exportToWord = () => {
    const { content } = this.props;
    mammoth.convertToHtml(content)
      .then((result) => {
        const blob = new Blob([result.value], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exported-document.docx';
        a.click()

        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('导出失败', error);
      });
  }

      handleSearch(value){
        let filterMsg = [];
        if(value){
            let queryStringArr = value.split("");
            let str = "(.*?)";
            let regStr = str + queryStringArr.join(str) + str;
            let reg = RegExp(regStr, "i"); // 以mh为例生成的正则表达式为/(.*?)m(.*?)h(.*?)/i
            this.state.options.map(item => {
            if (reg.test(item.value)) {
                filterMsg.push(item);
            }});
            // console.log(filterMsg)
            this.setState({
                filtermsg : filterMsg
            })
        }
    }


    render() {
    const imgStyle = {
      display: 'block',
      width: 42,
      height: 42,
    };


    // 日期选择框
    const { RangePicker } = DatePicker;
    const onChange = (date) => {
      if (date) {
        console.log('Date: ', date);
      } else {
        console.log('Clear');
      }
    };
    const onRangeChange = (dates, dateStrings) => {
      if (dates) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);

      } else {
        console.log('Clear');
      }
    };
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
    let istype_small = false


    const DemoPie = () => {
      const data = [
        {
          type: '刑事',
          value: 33,
        },
        {
          type: '治安',
          value: 257,
        },
        {
          type: '交通警情',
          value: 1432,
        },
        {
          type: '社会纠纷',
          value: 491,
        },
        {
          type: '群众求助',
          value: 1923,
        },
        {
          type: '举报违法犯罪线索',
          value: 78,
        },
        {
          type: '重复警情',
          value: 745,
        },

      ];
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
         height: 420,
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
      return <Pie {...config} />;
    };
    // const echart=DemoPie.getDataURL({
    //   RixelRatio:2,
    //   backgroundColor:'#fff',
    // });
    const DemoBar = () => {
      const data = [
        {
          year: '天穆所',
          value: 384,
          type: '全部警情',
        },
        {
          year: '宜兴埠所',
          value: 362,
          type: '全部警情',
        },
        {
          year: '普东所',
          value: 360,
          type: '全部警情',
        },
        {
          year: '小淀所',
          value: 271,
          type: '全部警情',
        },
        {
          year: '西堤头所',
          value: 268,
          type: '全部警情',
        },
        {
          year: '双口所',
          value: 262,
          type: '全部警情',
        },
        {
          year: '瑞景所',
          value: 262,
          type: '全部警情',
        },
        {
          year: '双街所',
          value: 248,
          type: '全部警情',
        },
        {
          year: '青光所',
          value: 225,
          type: '全部警情',
        },
        {
          year: '天穆所',
          value: 5,
          type: '刑事警情',
        },
        {
          year: '宜兴埠所',
          value: 4,
          type: '刑事警情',
        },
        {
          year: '普东所',
          value: 3,
          type: '刑事警情',
        },

        {
          year: '小淀所',
          value: 5,
          type: '刑事警情',
        },
        {
          year: '西堤头所',
          value: 2,
          type: '刑事警情',
        },
        {
          year: '双口所',
          value: 1,
          type: '刑事警情',
        },
        {
          year: '瑞景所',
          value: 2,
          type: '刑事警情',
        },
        {
          year: '双街所',
          value: 3,
          type: '刑事警情',
        },
        {
          year: '青光所',
          value: 1,
          type: '刑事警情',
        },
        {
          year: '天穆所',
          value: 3,
          type: '治安警情',
        },
        {
          year: '宜兴埠所',
          value: 14,
          type: '治安警情',
        },
        {
          year: '普东所',
          value: 13,
          type: '治安警情',
        },

        {
          year: '小淀所',
          value: 5,
          type: '治安警情',
        },
        {
          year: '西堤头所',
          value: 4,
          type: '治安警情',
        },
        {
          year: '双口所',
          value: 6,
          type: '治安警情',
        },
        {
          year: '瑞景所',
          value: 7,
          type: '治安警情',
        },
        {
          year: '双街所',
          value: 9,
          type: '治安警情',
        },
        {
          year: '青光所',
          value: 13,
          type: '治安警情',
        },

        {
          year: '天穆所',
          value: 3,
          type: '电信诈骗',
        },
        {
          year: '宜兴埠所',
          value: 4,
          type: '电信诈骗',
        },
        {
          year: '普东所',
          value: 3,
          type: '电信诈骗',
        },

        {
          year: '小淀所',
          value: 5,
          type: '电信诈骗',
        },
        {
          year: '西堤头所',
          value: 4.9,
          type: '电信诈骗',
        },
        {
          year: '双口所',
          value: 6,
          type: '电信诈骗',
        },
        {
          year: '瑞景所',
          value: 7,
          type: '电信诈骗',
        },
        {
          year: '双街所',
          value: 5,
          type: '电信诈骗',
        },
        {
          year: '青光所',
          value: 3,
          type: '电信诈骗',
        },
        {
          year: '天穆所',
          value: 3,
          type: '重复警情',
        },
        {
          year: '宜兴埠所',
          value: 74,
          type: '重复警情',
        },
        {
          year: '普东所',
          value: 69,
          type: '重复警情',
        },

        {
          year: '小淀所',
          value: 95,
          type: '重复警情',
        },
        {
          year: '西堤头所',
          value: 33,
          type: '重复警情',
        },
        {
          year: '双口所',
          value: 36,
          type: '重复警情',
        },
        {
          year: '瑞景所',
          value: 27,
          type: '重复警情',
        },
        {
          year: '双街所',
          value: 39,
          type: '重复警情',
        },
        {
          year: '青光所',
          value: 13,
          type: '重复警情',
        },
      ];
      const config = {
        data: data.reverse(),
        height: 420,
        width: 720,
        isStack: true,
        xField: 'value',
        yField: 'year',
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
      return <Bar {...config} />;
    };

    const DemoBar1 = () => {
      const data = [
        {
          year: '天穆所',
          value: 17605,
          type: '全部警情',
        },
        {
          year: '宜兴埠所',
          value: 16889,
          type: '全部警情',
        },
        {
          year: '普东所',
          value: 12025,
          type: '全部警情',
        },
        {
          year: '小淀所',
          value: 11807,
          type: '全部警情',
        },
        {
          year: '西堤头所',
          value: 11336,
          type: '全部警情',
        },
        {
          year: '双口所',
          value: 10853,
          type: '全部警情',
        },
        {
          year: '瑞景所',
          value: 10735,
          type: '全部警情',
        },
        {
          year: '双街所',
          value: 10697,
          type: '全部警情',
        },
        {
          year: '青光所',
          value: 9046,
          type: '全部警情',
        },
        {
          year: '天穆所',
          value: 248,
          type: '刑事警情',
        },
        {
          year: '宜兴埠所',
          value: 94,
          type: '刑事警情',
        },
        {
          year: '普东所',
          value: 113,
          type: '刑事警情',
        },

        {
          year: '小淀所',
          value: 115,
          type: '刑事警情',
        },
        {
          year: '西堤头所',
          value: 92,
          type: '刑事警情',
        },
        {
          year: '双口所',
          value: 111,
          type: '刑事警情',
        },
        {
          year: '瑞景所',
          value: 102,
          type: '刑事警情',
        },
        {
          year: '双街所',
          value: 93,
          type: '刑事警情',
        },
        {
          year: '青光所',
          value: 91,
          type: '刑事警情',
        },
        {
          year: '天穆所',
          value: 1223,
          type: '治安警情',
        },
        {
          year: '宜兴埠所',
          value: 1124,
          type: '治安警情',
        },
        {
          year: '普东所',
          value: 813,
          type: '治安警情',
        },

        {
          year: '小淀所',
          value: 875,
          type: '治安警情',
        },
        {
          year: '西堤头所',
          value: 984,
          type: '治安警情',
        },
        {
          year: '双口所',
          value: 856,
          type: '治安警情',
        },
        {
          year: '瑞景所',
          value: 677,
          type: '治安警情',
        },
        {
          year: '双街所',
          value: 749,
          type: '治安警情',
        },
        {
          year: '青光所',
          value: 613,
          type: '治安警情',
        },

        {
          year: '天穆所',
          value: 163,
          type: '电信诈骗',
        },
        {
          year: '宜兴埠所',
          value: 94,
          type: '电信诈骗',
        },
        {
          year: '普东所',
          value: 83,
          type: '电信诈骗',
        },

        {
          year: '小淀所',
          value: 85,
          type: '电信诈骗',
        },
        {
          year: '西堤头所',
          value: 47,
          type: '电信诈骗',
        },
        {
          year: '双口所',
          value: 69,
          type: '电信诈骗',
        },
        {
          year: '瑞景所',
          value: 77,
          type: '电信诈骗',
        },
        {
          year: '双街所',
          value: 85,
          type: '电信诈骗',
        },
        {
          year: '青光所',
          value: 53,
          type: '电信诈骗',
        },
        {
          year: '天穆所',
          value: 4543,
          type: '重复警情',
        },
        {
          year: '宜兴埠所',
          value: 3564,
          type: '重复警情',
        },
        {
          year: '普东所',
          value: 3269,
          type: '重复警情',
        },

        {
          year: '小淀所',
          value: 2395,
          type: '重复警情',
        },
        {
          year: '西堤头所',
          value: 2333,
          type: '重复警情',
        },
        {
          year: '双口所',
          value: 1836,
          type: '重复警情',
        },
        {
          year: '瑞景所',
          value: 1827,
          type: '重复警情',
        },
        {
          year: '双街所',
          value: 1639,
          type: '重复警情',
        },
        {
          year: '青光所',
          value: 1313,
          type: '重复警情',
        },
      ];
      const config = {
        data: data.reverse(),
        height: 420,
        width: 720,
        isStack: true,
        xField: 'value',
        yField: 'year',
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
      return <Bar {...config} />;
    };

    const DemoBar2 = () => {
    const data = [
      {
        label: '有效警情',
        type: '同比',
        value: 7,
      },
      {
        label: '有效警情',
        type: '环比',
        value: -3,
      },
      {
        label: '刑事警情',
        type: '同比',
        value: -27,
      },
      {
        label: '刑事警情',
        type: '环比',
        value: 3,
      },
      {
        label: '行政（治安）警情',
        type: '同比',
        value: 64,
      },
      {
        label: '行政（治安）警情',
        type: '环比',
        value: 14,
      },
      {
        label: '交通警情',
        type: '同比',
        value: 25,
      },
      {
        label: '交通警情',
        type: '环比',
        value: -10,
      },

    ];
    const config = {
      data,
      height: 420,
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
    return <Bar {...config} />;
  };

    const ExportWordDocument = () => {
        const [documentContent, setDocumentContent] = useState('Hello, World!');

        const exportToWord = () => {
        // Load the template content
        const templateContent = fs.readFileSync('path/to/your/template.docx', 'binary');
        const template = new Docxtemplater();
        template.load(templateContent);

        // Set the data for the template
        const data = {
          content: documentContent,
        };

        // Bind the data to the template
        template.setData(data);

        // Render the template (replace variables with data)
        template.render();

        // Get the output as a buffer
        const buffer = template.getZip().generate({ type: 'nodebuffer' });

        // Save the buffer to a Word document
        fs.writeFileSync('path/to/exported/document.docx', buffer);
      };
    };

    return (
      <RcResizeObserver
        key="resize-observer"
        // onResize={(offset) => {
        //   this.setState({
        //     setResponsive: offset.width < 596,
        //   });
        // }}
      >
        <div  className="KG_container"
              // title="事件统计"
              // split={this.state.responsive ? 'horizontal' : 'vertical'}
              // bordered
            >
                  <ProCard title="事件统计" bordered gutter={8}>
                    <ProCard bordered colSpan="30%" >
                        <RangePicker  presets={rangePresets} onChange={ (data, dataString)  => this.handleTime( data, dataString)} />
                      </ProCard>
                    <ProCard bordered colSpan="40%"  >
                      <Button
                          type="primary"
                          onClick={this.exportEmptyWordDocument}>
	                     点击查询并导出
                      </Button>
                    </ProCard>
                  </ProCard>
            </div>

      </RcResizeObserver>
    );
  }


}


export default Export;