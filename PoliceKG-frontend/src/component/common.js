import React, { useState, useEffect } from 'react';
import './common.less';
import 'echarts-wordcloud';
import * as echarts from 'echarts'




export function WordCloud(props) {

     useEffect(() => {
        console.log("模拟componentDidMount，即只运行一次该函数");
        // const res =  getSearchRes()
        //  console.log(res)
        // initData()

    }, []);
    function  initData(){
        const echartDom = document.getElementById('myEchart')
        if(echartDom){
            console.log('获取到dom')
        }
        const myChart = echarts.init(echartDom)
        const option  = {
                series: [{
                type: 'wordCloud',
                shape: 'circle',
                keepAspect: false,
               // maskImage: maskImage,
                left: 'center',
                top: 'center',
                width: '100%',
                height: '90%',
                right: null,
                bottom: null,
                sizeRange: [12, 60],
                rotationRange: [-90, 90],
                rotationStep: 45,
                gridSize: 8,
                drawOutOfBound: false,
                layoutAnimation: true,
                textStyle: {
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    color: function () {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                },
                emphasis: {
                    // focus: 'self',
                    textStyle: {
                        textShadowBlur: 3,
                        textShadowColor: '#333'
                    }
                },
                //data属性中的value值却大，权重就却大，展示字体就却大
                data: [
                    {name: 'Farrah',value: 366},
                    {name: "汽车",value: 900},
                    {name: "视频",value: 606},
                ]
            }]

           }
           myChart.setOption(option)

           //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                myChart.resize();
            });
    }

  return (
      <div className="wordcloud">
            <div id="myEchart" style={{width: 420, height:200}}></div>
      </div>
  );
}
