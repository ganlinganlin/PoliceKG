import React, { useState } from 'react';
import './index.less';
import { WordCloud } from '@/component/common'
import { Space, Button, Input, DatePicker,Table,Select  } from 'antd';
import ProCard from '@ant-design/pro-card';
import { ProFormText, ProForm, ModalForm } from '@ant-design/pro-components';
import {getSearchRes} from '@/server/kg.js'
import Node from './node_content';
import KGContent from './kg_content';
import { json } from 'd3';
import HttpUtils from '@/utils/HttpUtils';
import ApiUtils from '@/utils/ApiUtils';

import dayjs from 'dayjs';

class KG extends React.Component {
    constructor(props) {
      super(props);
      console.log('kg');
      this.state = {
        responsive: true,
        options:[],
        filtermsg:[],
        columns:[
        {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
          },
          {
            title: '地点',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: '事件类型',
            dataIndex: 'event',
            filters: [
              {
                text: '行政(治安)警情',
                value: '行政(治安)警情',
              },
            ],
            onFilter: (value, record) => record.event.startsWith(value),
            filterSearch: true,
          },
          {
            title: '事件发生次数',
            dataIndex: 'number',
            sorter: (a, b) => a.number - b.number,
          },
        ],
        nodeinfo: {
          id: '',
          label: '',
          properties: {
            name: '',
            address: '',
            time: '',

            category: '',
            small: '',
            thin: '',
            type: '',

            branch_public_security_bureau: '',
            first_unit: '',
            link_unit: '',

            content: '',
            event: '',
            feedback: '',
            source: '',
            status: ''

          },
        },
        title: '结点信息',
        nodes: [],
        links: [],
        searchnodes:[],
        searchlinks:[],
        tabledata : [],
        status: '',
        flag: false,
        address : '',
        time : {
          start_time : '',
          end_time : '',
        },
      };
    }

    componentDidMount() {
      this.getAddressList()
    }


    onSearch(value) {
      console.log(value);
      // 向后端传输数据 -> 获取res
      HttpUtils.post(ApiUtils.API_SEARCH, value)
        .then((res) => {
          console.log('返回结果:', res);
          this.setState({
            nodes: res.nodes,
            links: res.links,
          });
          // console.log(this.state.searchnodes)
          // console.log(this.state.searchlinks)
        })
        .catch((error) => {
          console.log('error: ' + error.message);
        });
    }

    callback = (nodeinfo) => {
      this.setState({ nodeinfo: nodeinfo });
      // console.log('父组件', nodeinfo);
    };


    // 查询事件
    onCLickButton(){
      console.log("点击查询")
      // console.log(this.state.address)
      // console.log(this.state.time)
      const params =  {
        "address" : this.state.address[0],
        "start_time" : this.state.time['start_time'],
        "end_time" : this.state.time['end_time']
      }
      console.log(params)
      // 查询
      HttpUtils.post(ApiUtils.API_SEARCH_EVENT, params)
        .then((res) => {
          // console.log('返回结果:', res.res[0]);
          let nodes = [];
          let links = []; // 存放节点和关系
          let nodeSet = []; // 存放去重后nodes的id
          res.res[0].map((item) =>{
             if (nodeSet.indexOf(item.source.id) == -1) {
              nodeSet.push(item.source.id);
              nodes.push({
                id: item.source.id,
                label: item.source.label,
                properties: item.source.properties,
              });
            }
            if (nodeSet.indexOf(item.target.id) == -1) {
              nodeSet.push(item.target.id);
              nodes.push({
                id: item.target.id,
                label: item.target.label,
                properties: item.target.properties,
              });
            }
            links.push({
              source: item.source.id,
              target: item.target.id,
              type: item.type,
              properties: {},
            });
          })

          // console.log(nodes,links)

          this.setState({
            searchnodes: nodes,
            searchlinks: links,
          });
          // console.log(this.state.nodes)
          // console.log(this.state.links)
        })
        .catch((error) => {
          console.log('error: ' + error.message);
        });

      HttpUtils.post(ApiUtils.API_SEARCH_EVENT_NUMBER,params)
          .then((res)=>{
            console.log(res)
            let obj = []
            res.map(( item, index)=>{
              obj.push({
                key: index,
                time: item.time,
                address: item.address,
                event: item.event,
                number: item.number,
              })
            })

            this.setState({
              tabledata : obj
            })
            console.log(this.state.tabledata)
        })
          .catch((error)=>{
            console.log('error: ' + error.message);
          })
    }

    handleTime( data, dataString){
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
        time : {
          start_time : start,
          end_time : end,
        }
      })
    }

    async getAddressList(){
      // 查询 全部地址
      HttpUtils.get(ApiUtils.API_WHOLE_ADDRESS)
        .then((res) => {
          console.log('返回结果:', res);
          let addlist = []
          res.map((item)=>{
              addlist.push({
                value: item.n.properties.address,
                label: item.n.properties.address
          })
          })
            this.setState({
                options : addlist,
                filtermsg : addlist,
            })
         })
        .catch((error) => {
          console.log('error: ' + error.message);
        });
    }
    handleChange(value){
        this.setState({
            value,
            address : value
        })
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
    // const searchCard = (
    //   <ProCard>
    //     <Input.Search
    //       placeholder="请输入"
    //       enterButton="搜索"
    //       size="large"
    //       // value={searchText}
    //       // onChange={(e) => {
    //       //     setSearchText(e.target.value);
    //       // }}
    //       onSearch={this.onSearch.bind(this)}
    //       style={{ maxWidth: 522, width: '100%' }}
    //     />
    //   </ProCard>
    // );

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
    //表格
    const columns = [
      {
        title: '时间',
        dataIndex: 'time',
        filters: [
          {
            text: '2023-08-15',
            value: '2023-08-15',
          },
          {
            text: '2023-08-16',
            value: '2023-08-16',
          },
          {
            text: '2023-08-17',
            value: '2023-08-17',
          },
        ],
        filterMode: 'tree',
        filterSearch: true,
        onFilter: (value, record) => record.time.startsWith(value),
        // width: '20%',
      },
      {
        title: '地点',
        dataIndex: 'address',
        // sorter: (a, b) => a.age - b.age,
        // width: '20%',
      },
      {
        title: '事件类型',
        dataIndex: 'event',
        filters: [
          {
            text: '行政(治安)警情',
            value: '行政(治安)警情',
          },
        ],
        onFilter: (value, record) => record.event.startsWith(value),
        filterSearch: true,
      },
      // istype_small  && {
      //   title: '事件小类',
      //   dataIndex: 'event',
      //   filters: [
      //     {
      //       text: '行政(治安)警情',
      //       value: '行政(治安)警情',
      //     },
      //   ],
      //   onFilter: (value, record) => record.addreventess.startsWith(value),
      //   filterSearch: true,
      // },
      {
        title: '事件发生次数',
        dataIndex: 'number',
        sorter: (a, b) => a.number - b.number,
        // width: '20%',
      },
      // {
      //   filters: [
      //     {
      //       text: '事件小类',
      //       value: istype_small,
      //     },
      //   ],
      //   onFilter: (value, istype_small) => istype_small.startsWith(value),
      //   filterSearch: true,
      // }
    ].filter(Boolean);

    const data = [
      {
        key: '1',
        time: '2023.08.09',
        address: '天津市北辰区双口镇双口一村',
        event: '行政警情',
        number: 11,
      },
      {
        key: '2',
        time: '2023.08.09',
        address: '天津市北辰区双口镇双口二村',
        event: '行政警情',
        number: 23,
      },
      {
        key: '3',
        time: '2023.08.09',
        address: '天津市北辰区双口镇双口三村',
        event: '行政警情',
        number: 43,
      },
      {
        key: '4',
        time: '2023.08.09',
        address: '天津市北辰区双口镇双口四村',
        event: '行政警情',
        number: 13,
      },
    ];
    const onChange1 = (pagination, filters, sorter, extra) => {
      console.log('params', pagination, filters, sorter, extra);
    };

    return (
            <div  className="KG_container"
              // title="事件统计"
              // split={this.state.responsive ? 'horizontal' : 'vertical'}
              // bordered
            >
                  <ProCard title="事件统计" bordered gutter={8}>
                    <ProCard bordered colSpan="30%" >
                        <RangePicker  presets={rangePresets} onChange={ (data, dataString)  => this.handleTime( data, dataString)} />
                      </ProCard>
                    <ProCard bordered colSpan="30%"  >
                        <Select mode="tags" style={{ width: '100%' }}
                                showSearch
                                placeholder="请输入查询地址"
                                value={this.state.value}
                                onChange={(value)=>this.handleChange(value)}
                                onSearch={(value) => this.handleSearch(value)}
                                filterOption={false}
                                defaultActiveFirstOption={false}
                        >
                            {this.state.filtermsg.map(d => <Select.Option key={d.value}>{d.label}</Select.Option>)}
                        </Select>
                       </ProCard>
                    <ProCard bordered colSpan="40%"  >
                      {/*<div>*/}
                         <Button type="primary" onClick={this.onCLickButton.bind(this)}>
                                点击查询
                         </Button>
                      {/*</div>*/}

                    </ProCard>
                  </ProCard>
                  <ProCard style={{ marginBlockStart: 20 }} gutter={20}  split={'vertical'}>
                      <ProCard style={{ marginBlockStart: 20 }} gutter={20}   bordered colSpan="30%"   split={'horizontal'}>
                          {/*<ProCard ><WordCloud/></ProCard>*/}
                          <ProCard >
                               <KGContent callback={this.callback} searchnodes={this.state.searchnodes} searchlinks ={this.state.searchlinks}/>
                          </ProCard>
                      </ProCard >
                      <ProCard bordered style={{ marginBlockStart: 20 }} gutter={20}  >
                          <Table columns={columns} dataSource={this.state.tabledata} onChange={onChange1} />
                      </ProCard>
                  </ProCard>
            </div>
    );

  }


}
export default KG;
