import React, { useState } from 'react';
import RcResizeObserver from 'rc-resize-observer';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { Pie,Bar } from '@ant-design/plots';
import KGContent from '../kg/kg_content';
import './index.less';

class Statistic extends React.Component {
  constructor(props) {
    super(props);
    console.log('Statistic');
    this.state = {
      responsive: true,
    };
  }

  render() {
    const imgStyle = {
      display: 'block',
      width: 42,
      height: 42,
    };

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

    return (
      <RcResizeObserver
        key="resize-observer"
        // onResize={(offset) => {
        //   this.setState({
        //     setResponsive: offset.width < 596,
        //   });
        // }}
      >
        <ProCard
          className="content"
          split={this.state.responsive ? 'horizontal' : 'vertical'}
          gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          ghost
        >
          <ProCard
            split={this.state.responsive ? 'horizontal' : 'vertical'}
            gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
            ghost
          >
            <ProCard className="statisticCard" ghost>
              <StatisticCard.Group
                colSpan="30%"
                gutter={8}
                ghost
                direction={this.state.responsive ? 'row' : 'column'}
              >
                <StatisticCard
                  hoverable
                  statistic={{
                    title: '实体总数',
                    value: '4351',
                    icon: (
                      <img
                        style={imgStyle}
                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                        alt="icon"
                      />
                    ),
                  }}
                />
                <StatisticCard
                  hoverable
                  statistic={{
                    title: '关系总数',
                    value: '1630',
                    icon: (
                      <img
                        style={imgStyle}
                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                        alt="icon"
                      />
                    ),
                  }}
                />

                <StatisticCard
                  hoverable
                  statistic={{
                    title: '属性总数',
                    value: '5032',
                    icon: (
                      <img
                        style={imgStyle}
                        src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                        alt="icon"
                      />
                    ),
                  }}
                />
              </StatisticCard.Group>
            </ProCard>

            {/*<ProCard className="statisticCard" ghost>*/}
            {/*  <StatisticCard.Group*/}
            {/*    colSpan="30%"*/}
            {/*    gutter={8}*/}
            {/*    ghost*/}
            {/*    direction={this.state.responsive ? 'row' : 'column'}*/}
            {/*  >*/}
            {/*    <StatisticCard*/}
            {/*      hoverable*/}
            {/*      statistic={{*/}
            {/*        title: '课程实体',*/}
            {/*        value: '20',*/}
            {/*        icon: (*/}
            {/*          <img*/}
            {/*            style={imgStyle}*/}
            {/*            src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"*/}
            {/*            alt="icon"*/}
            {/*          />*/}
            {/*        ),*/}
            {/*      }}*/}
            {/*    />*/}

            {/*    <StatisticCard*/}
            {/*      hoverable*/}
            {/*      statistic={{*/}
            {/*        title: '概念实体',*/}
            {/*        value: '326',*/}
            {/*        icon: (*/}
            {/*          <img*/}
            {/*            style={imgStyle}*/}
            {/*            src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"*/}
            {/*            alt="icon"*/}
            {/*          />*/}
            {/*        ),*/}
            {/*      }}*/}
            {/*    />*/}
            {/*    <StatisticCard*/}
            {/*      hoverable*/}
            {/*      statistic={{*/}
            {/*        title: '操作实体',*/}
            {/*        value: '1247',*/}
            {/*        icon: (*/}
            {/*          <img*/}
            {/*            style={imgStyle}*/}
            {/*            src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"*/}
            {/*            alt="icon"*/}
            {/*          />*/}
            {/*        ),*/}
            {/*      }}*/}
            {/*    />*/}
            {/*    <StatisticCard*/}
            {/*      hoverable*/}
            {/*      statistic={{*/}
            {/*        title: '方法实体',*/}
            {/*        value: '2758',*/}
            {/*        icon: (*/}
            {/*          <img*/}
            {/*            style={imgStyle}*/}
            {/*            src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"*/}
            {/*            alt="icon"*/}
            {/*          />*/}
            {/*        ),*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </StatisticCard.Group>*/}
            {/*</ProCard>*/}
          </ProCard>
          <ProCard className="statistic" gutter={8} ghost>
              <ProCard
                    colSpan="50%"
                    layout="center"
                    title="本周警情综述"
                    // split={this.state.responsive ? 'horizontal' : 'vertical'}
                  >
                      <DemoBar2 />
              </ProCard>
              <ProCard layout="center" title="全局有效警情分类情况">
                  <DemoPie />
              </ProCard>
          </ProCard>
          <ProCard className="statistic" gutter={8} ghost>
              <ProCard layout="center" title="本时段各单位110接报警情一览表（2023年10月26日至11月1日）">
                  <DemoBar />
              </ProCard>
              <ProCard layout="center" title="2023年以来各单位110接报警情一览表（2023年1月1日至11月1日）">
                  <DemoBar1 />
              </ProCard>
          </ProCard>


        </ProCard>
      </RcResizeObserver>
    );
  }
}
export default Statistic;
