import React, { useState } from 'react';
import './index.less';

import RcResizeObserver from 'rc-resize-observer';
import { Space, Button, Input, DatePicker,Table,Select  } from 'antd';
import ProCard from '@ant-design/pro-card';
import { ProFormText, ProForm, ModalForm } from '@ant-design/pro-components';

import KGAddress from './kg_address';
import { json } from 'd3';
import HttpUtils from '../../utils/HttpUtils';
import ApiUtils from '../../utils/ApiUtils';

import dayjs from 'dayjs';

class ADDRESS extends React.Component{
 constructor(props) {
      super(props);
      console.log('kg');
      this.state = {
        responsive: true,
        options:[],
        filtermsg:[],

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
        number : '',
        time : {
          start_time : '',
          end_time : '',
        },
      };
    }

    componentDidMount() {
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
      // console.log(this.state.number)
      // console.log(this.state.time)
      const params =  {
        "number" : this.state.number,
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
                number: item.number,
                address: item.address,
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

        handleChange(value){
        this.setState({
            value,
            number : value
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




    render() {

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

      },

      {
        title: '事件发生次数',
        dataIndex: 'number',
        sorter: (a, b) => a.number - b.number,
        // width: '20%',
      },
        {
        title: '地点',
        dataIndex: 'address',

      },



    ].filter(Boolean);


    const onChange1 = (pagination, filters, sorter, extra) => {
      console.log('params', pagination, filters, sorter, extra);
    };

    return (
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          this.setState({
            setResponsive: offset.width < 596,
          });
        }}
      >
            <ProCard
              className="KG_container"
              title="地点统计"
              split={this.state.responsive ? 'horizontal' : 'vertical'}
              bordered
            >

                  {/*{searchCard}*/}
                  <ProCard style={{ marginBlockStart: 8 }} gutter={8}>
                    <ProCard bordered colSpan="30%" >
                              <RangePicker  presets={rangePresets} onChange={ (data, dataString)  => this.handleTime( data, dataString)} />
                      </ProCard>
                    <ProCard bordered colSpan="30%"  >
                        {/*<Input placeholder="请输入至少发生的事件次数n" defaultValue="0" value={this.state.value} onChange={(value)=>this.handleChange(value)} />*/}
                        <Select mode="tags" style={{ width: '100%' }}
                                showSearchjiyu
                                placeholder="请输入至少发生的事件次数n,默认为0"
                                value={this.state.value}
                                onChange={(value)=>this.handleChange(value)}
                                filterOption={false}
                                defaultActiveFirstOption={false}
                        >
                            {this.state.filtermsg.map(d => <Select.Option key={d.value}>{d.label}</Select.Option>)}
                        </Select>
                    </ProCard>
                    <ProCard bordered colSpan="40%"  >
                      <div>
                         <Button type="primary" onClick={this.onCLickButton.bind(this)}>
                                点击查询
                         </Button>
                      </div>

                    </ProCard>
                  </ProCard>
                  <ProCard style={{ marginBlockStart: 8 }} gutter={8}>
                          <ProCard bordered colSpan="30%" >
                            <KGAddress callback={this.callback} searchnodes={this.state.searchnodes} searchlinks ={this.state.searchlinks}/>
                          </ProCard>

                          <ProCard bordered  >
                            <Table columns={columns} dataSource={this.state.tabledata} onChange={onChange1} />
                          </ProCard>
                  </ProCard>
            </ProCard>
      </RcResizeObserver>
    );

  }





}

export default ADDRESS;
