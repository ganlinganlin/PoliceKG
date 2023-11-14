import React from 'react';
import ProCard from '@ant-design/pro-card';
import { Space, Button, Input } from 'antd';
import * as d3 from 'd3';
import HttpUtils from '../../utils/HttpUtils';
import ApiUtils from '../../utils/ApiUtils';
import GraphUtils from '../../utils/GraphUtils';
import './index.less';

class KGAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status : '',
      ColorList: {
        ADDRESS: '#ff00d7',
        TIME: '#00c7ff',
        PRU: '#6c5405',
        Alarm_Category: '#7a0405',
        Feedback_Category: '#774f03',

        Administrative_EVENT: '#e79381',
        Criminal_EVENT: '#9dd9e8',
        Dispute_EVENT: '#f1bba0',
        Help_EVENT: '#e8e385',
        Linkage_EVENT: '#9ce3c6',
        Other_EVENT: '#d4d98c',
        Report_EVENT: '#f33394',
        Suggestion_EVENT: '#bd63f3',
        Traffic_EVENT: '#00ff47',
      },
      height: 420,
      width: 420,
      r: 30,
      label: ['ADDRESS','TIME','PRU','Alarm_Category','Feedback_Category','Administrative_EVENT','Criminal_EVENT','Dispute_EVENT',
        'Help_EVENT','Linkage_EVENT','Other_EVENT','Report_EVENT','Suggestion_EVENT','Traffic_EVENT'],
      searchnodes: [],
      searchlinks: [],
      simulation: null,
      node: [],
      link: [],
      nodeText: null,
      marker: null,
      nodecount: 0,
      // nodeinfo: null
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
          status: '',
        }
      },
    };
  }
  componentDidUpdate(){

    if(this.props.searchnodes.length != 0){
      // this.draw(this.props.searchres.links, this.props.searchres.nodes)
      console.log('update',this.props.searchnodes, this.props.searchlinks)
      const nodes = this.props.searchnodes
      const links = this.props.searchlinks
      this.draw( links, nodes)
    }
  }

  componentDidMount() {
    // 从后台获取数据
    // this.getGraph()
    this.get_graph();
    // console.log('mount',this.props.searchres)
  }


  //点击节点后显示信息
  onClickSearch(e) {
    // console.log('click', e.target)
    console.log(e.target.id);
    HttpUtils.post(ApiUtils.API_SEARCH_NODE, e.target.id)
      .then((res) => {
        console.log('返回结果:', res.node);
        // console.log(res.node.properties)
        // 更改参数
        this.setState({
          nodeinfo: {
            id: res.node.id,
            label: res.node.label,
                properties: {
                  name: res.node.properties['name'],
                  address: res.node.properties['address'],
                  time: res.node.properties['time'],

                  category: res.node.properties['category'],
                  small: res.node.properties['small'],
                  thin: res.node.properties['thin'],
                  type: res.node.properties['type'],

                  branch_public_security_bureau: res.node.properties['branch_public_security_bureau'],
                  first_unit: res.node.properties['first_unit'],
                  link_unit: res.node.properties['link_unit'],

                  content: res.node.properties['content'],
                  event: res.node.properties['event'],
                  feedback: res.node.properties['feedback'],
                  source: res.node.properties['source'],
                  status: res.node.properties['status'],

                },

          }

        });
        this.props.callback(this.state.nodeinfo); // 向父组件传递
      })
      .catch((error) => {
        console.log('error: ' + error.message);
      });

    console.log('点击节点后', this.state.nodeinfo);
  }

  //画图
  draw(searchlinks, searchnodes) {
    const { ColorList, height, width, r } =
      this.state;
    // console.log(searchnodes)
    // console.log(searchlinks)
    d3.select('#KG_svg').selectAll('*').remove();

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    const zoom = d3
      .zoom()
      .scaleExtent([0.2, 4]) // 设置最大缩放比例
      .on('zoom', function (d) {
        zoomed(d.transform);
      });

    const sim = d3
      .forceSimulation(searchnodes)
      .alphaDecay(0.1)
      .force(
        'link',
        d3
          .forceLink(searchlinks)
          .id(function (n) {
            return n.id;
          })
          .distance(200),
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(50).iterations(10))
      .force('charge', d3.forceManyBody().strength(-200));

    const svg = d3
      .select('#KG_svg')
      .style('width', width)
      .style('height', height)
      .style('background-color', '#F9FCFF')
      // .on('click', (d)=>{
      //     console.log(d.target)
      // })
      .call(zoom);

    const g = svg.append('g');

    const link = g
      .append('g')
      .selectAll('path')
      .data(searchlinks)
      .enter()
      .append('path')
      .attr('class', 'links')
      .style('stroke', '#999')
      .style('stroke-width', 2)
      .attr('marker-end', 'url(#direction)');

    const node = g
      .append('g')
      .selectAll('circle')
      .data(searchnodes)
      .enter()
      .append('circle')
      .attr('class', 'nodes')
      .attr('id', (d) => d.id)
      // .attr('value', (d)=> d.title)
      .attr('r', function (d) {
        if (d.label == 'TIME') return 70;
        else if (d.label == 'ADDRESS') return 50;
        else return r;
      })
      .style('fill', function (d) {
        return ColorList[d.label];
      }) // 填充颜色
      .style('stroke', 'white') // 边框颜色
      .style('stroke-width', 2) // 边框粗细
      .on('click', this.onClickSearch.bind(this))
      // .on('dblclick', null)
      .call(drag(sim));

    node.append('title').text(function (d) {
      // console.log(d)
      return d.properties.name;
    });

    const nodeText = g
      .append('g')
      .selectAll('text')
      .data(searchnodes)
      .join('text')
      .attr('dy', '.3em')
      .attr('class', 'node-name')
      .attr('text-anchor', 'middle')
      .style('pointer-events', 'none')
      // .attr('fill', '')
      .text(function (d) {
        return d.properties.name;
      });

    const marker = g
      .append('g')
      .append('marker')
      .attr('id', 'direction')
      .attr('refX', 35)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('stroke-width', 2)
      .attr('markerUnits', 'strokeWidth')
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('viewBox', '0 -5 10 10')
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .append('path')
      .attr('d', 'M 0 -5 L 10 0 L 0 5')
      .attr('fill', '#999')
      .attr('stroke-opacity', 0.6);

    sim.on('tick', function () {
      link.attr(
        'd',
        (d) =>
          ' M ' +
          d.source.x +
          ' ' +
          d.source.y +
          'L' +
          d.target.x +
          ' ' +
          d.target.y,
      );
      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

      nodeText.attr('x', (d) => d.x).attr('y', (d) => d.y);
    });

    function zoomed(transform) {
      g.attr('transform', transform);
    }

    // this.setState({
    //   simulation: sim,
    //   link: link,
    //   node: node,
    //   nodeText: nodeText,
    //   marker: marker,
    // });
  }

  update_graph() {
    const { ColorList, height, width, r, searchnodes, searchlinks} =
      this.state;



    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }


    const zoom = d3
      .zoom()
      .scaleExtent([0.2, 4]) // 设置最大缩放比例
      .on('zoom', function (d) {
        zoomed(d.transform);
      });
    console.log(searchnodes);

    function zoomed(transform) {
      g.attr('transform', transform);
    }

    const node = this.state.node
      .selectAll('circle')
      .data(searchnodes)
      .enter()
      .append('circle')
      .attr('class', function (d) {
        return d.label;
      })
      .attr('id', (d) => d.id)
      // .attr('value', (d)=> d.title)
      .attr('r', function (d) {
        if (d.label == 'TIME') return 70;
        else if (d.label == 'ADDRESS') return 50;
        else return r;
      })
      .style('fill', function (d) {
        return ColorList[d.label];
      }) // 填充颜色
      .style('stroke', 'white') // 边框颜色
      .style('stroke-width', 2) // 边框粗细
      .on('click', this.onClickSearch.bind(this))
      // .on('dblclick', null)
      .call(drag(sim));

    node.append('title').text(function (d) {
      return d.properties.name;
    });

    const link = this.state.link
      .selectAll('path')
      .data(searchlinks)
      .enter()
      .append('path')
      .attr('class', 'link')
      .style('stroke', '#999')
      .style('stroke-width', 2)
      .attr('marker-end', 'url(#direction)');

    const nodeText = this.state.nodeText
      .selectAll('text')
      .data(searchnodes)
      .join('text')
      .attr('dy', '.3em')
      .attr('class', 'node-name')
      .attr('text-anchor', 'middle')
      .style('pointer-events', 'none')
      // .attr('fill', '')
      .text(function (d) {
        return d.properties.name;
      });
    const marker = this.state.marker
      .append('marker')
      .attr('id', 'direction')
      .attr('refX', 35)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('stroke-width', 2)
      .attr('markerUnits', 'strokeWidth')
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('viewBox', '0 -5 10 10')
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .append('path')
      .attr('d', 'M 0 -5 L 10 0 L 0 5')
      .attr('fill', '#999')
      .attr('stroke-opacity', 0.6);

    this.state.simulation.on('tick', function () {
      link.attr(
        'd',
        (d) =>
          ' M ' +
          d.source.x +
          ' ' +
          d.source.y +
          'L' +
          d.target.x +
          ' ' +
          d.target.y,
      );
      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

      nodeText.attr('x', (d) => d.x).attr('y', (d) => d.y);
    });

    // console.log(this.state.link)
    // this.state.simulation.on('tick',function(){

    // })

    this.state.simulation.forceSimulation(searchnodes).alphaDecay(0.1);
    this.state.simulation.force(
      'link',
      d3
        .forceLink(searchlinks)
        .id(function (n) {
          return n.id;
        })
        .distance(200),
    );
    this.state.simulation.restart();

    // this.setState({
    //   link: link,
    //   node: node,
    //   nodeText: nodeText,
    //   marker: marker,
    // });
  }

  get_graph() {
    // console.log('搜索结构',this.props.searchres)
    let nodes = [];
    let links = []; // 存放节点和关系
    let nodeSet = []; // 存放去重后nodes的id
    HttpUtils.get(ApiUtils.API_WHOLE_GRAPH)
      .then((res) => {
        // console.log('返回结果:', res);
        console.log('返回知识图谱所有结点和关系：');
        console.log(res)
        for (let item of res) {
          for (let segment of item.p.segments) {
            // 重新更改data格式
            if (nodeSet.indexOf(segment.start.identity) == -1) {
              nodeSet.push(segment.start.identity);
              nodes.push({
                id: segment.start.identity,
                label: segment.start.labels[0],
                properties: segment.start.properties,
              });
            }
            if (nodeSet.indexOf(segment.end.identity) == -1) {
              nodeSet.push(segment.end.identity);
              nodes.push({
                id: segment.end.identity,
                label: segment.end.labels[0],
                properties: segment.end.properties,
              });
            }
            links.push({
              source: segment.relationship.start,
              target: segment.relationship.end,
              type: segment.relationship.type,
              properties: segment.relationship.properties,
            });
          }
        }
        // console.log(nodes[0].properties.name)
        // this.setState({
        //   searchlinks: links,
        //   searchnodes: nodes,
        //   // nodecount : res.nodes.length
        // });
        this.draw(links, nodes);
      })
      .catch((error) => {
        console.log('error: ' + error.message);
      });
  }

  render() {
    return (
      <div id="KG">
        <svg id="KG_svg"></svg>
      </div>
    );
  }
}

export default KGAddress;
