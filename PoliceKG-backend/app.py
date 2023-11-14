from flask import Flask, request, g, Response, send_from_directory, render_template, jsonify

from flask_cors import CORS, cross_origin
import datetime
from src.graph import GraphDB
from src import question_solve
import json
from json import dumps

# url = 'bolt://127.0.0.1:7687'
url = 'bolt://10.1.40.233:7687'

username = 'neo4j'
password = '123456'

app = Flask(__name__, template_folder='../PoliceKG-frontend', static_folder='../PoliceKG-frontend', static_url_path='')
# app = Flask(__name__,template_folder='./templates', static_folder='./static',static_url_path='')
CORS(app, resources=r'/*')
apiPrefix = '/api/v1/'

@app.route('/hello')
def hello():
    time = datetime.date.today()  #普通字符变量
    liebiao = ['111','222','333']  #列表类型
    zidian ={'11':'11','22':'22'}
    return 'hellohellohellohellohello'
    # return app.send_static_file('index.html')
    # return render_template("inde.html",var = time, list = liebiao, zi = zidian)

@app.route('/')
def get_index():
    return 'hello'
    # return app.send_static_file('index.html')




# entity searchgraph
@app.route( apiPrefix + 'searchgraph', methods=['POST'])

def get_search_graph():
    data = request.get_data(as_text = True)
    # new_data = data.replace('"','')
    new_data = json.loads(data)
    print('获取数据:', new_data)
    # res = {
    #     'code': 0,
    #     'data': data,
    #     'message': '测试数据'
    # }
    # print(type(new_data))
    db = GraphDB(url,username,password)
    links,nodes = db.search_graph(new_data)

    db.close()
    # return res
    return Response(dumps({"nodes": nodes, 'links': links}),
                    mimetype="application/json")

@app.route( apiPrefix + '/search_event', methods=['POST'])
@cross_origin()
def search_event():
    data = request.get_data(as_text=True)
    # 查询参数
    params = json.loads(data)
    print('获取数据:', params)
    # return params
    try:
        # TODO : 根据params 完成查询函数 返回节点和边数据 参考 graph.py search_graph return nodes links
        db = GraphDB(url, username, password)
        links, nodes = db.search_event(params)
        res = db.search_event(params)
        # print(res)
        db.close()
        # return Response(dumps({"nodes": nodes, "links": links}),
        #                 mimetype="application/json")
        return Response(dumps({"res": res}),
                        mimetype="application/json")
    except json.JSONDecodeError:
        return jsonify({"error": "无效的 JSON 数据"}), 400


@app.route( apiPrefix + '/search_event_number', methods=['POST'])
@cross_origin()
def search_event_number():
    data = request.get_data(as_text=True)
    # 查询参数
    params = json.loads(data)
    print('获取数据:', params)
    # return params
    try:
        # TODO : 根据params 完成查询函数 返回节点和边数据 参考 graph.py search_graph return nodes links
        db = GraphDB(url, username, password)
        # links, nodes = db.get_search_event_number(params)
        res = db.search_event_number(params)
        # print(res)
        db.close()
        # return Response(dumps({"nodes": nodes, "links": links}),
        #                 mimetype="application/json")
        return Response(dumps(res),
                        mimetype="application/json")
    except json.JSONDecodeError:
        return jsonify({"error": "无效的 JSON 数据"}), 400


# get whole graph
@app.route( apiPrefix + 'getgraph')
def get_graph():

    entities = ['ADDRESS','TIME','PRU','Alarm_Category','Feedback_Category',
                'Administrative_EVENT','Criminal_EVENT','Dispute_EVENT','Help_EVENT','Linkage_EVENT',
                'Other_EVENT','Report_EVENT','Suggestion_EVENT','Traffic_EVENT']

    db = GraphDB(url,username,password)
    res, rel,test = db.get_graph()
    print(res)
    print(rel)
    print(test)
    # temp = []
    # node = []
    # count = 0
    # for record in test:
    #     for path in record:
    #         # print(type(path))
    #         for node in path:
    #             # print(type(node))
    #             # print(node.nodes)
    #             source = db.serialize_node(node.nodes[0])
    #             target = db.serialize_node(node.nodes[1])
    #             # for item in node.nodes[0].labels:
    #             # print(tuple(node.nodes[0].labels)[0])
    #             temp.append({'source':source, 'target':target})
    # print(temp)
    #
    # nodes = []
    # rels = []
    # # test = []
    # i = 0
    # for record in res:
    #     nodes.append({'id': record['id'],'title': record[entities[0]], 'label': 'subj'})
    #     source =  i
    #     i += 1
    #     for item in record['conc']:
    #         # print(item.id)
    #         oper = {'id':item.id, 'title': item['title'],  "label": "conc"}
    #         try:
    #         #    target = int(item['id'])
    #            target = nodes.index(oper)
    #         #    nodes.append(oper)
    #         except ValueError:
    #             nodes.append(oper)
    #             target = i
    #             i += 1
    #         rels.append({'source':source, 'target':target})
    #
    # for r in rel:
    #     source = r['rel'].nodes[0]
    #     target = r['rel'].nodes[1]
    #     test.append({'source':source.id, 'target':target.id})
    #     print(source)
    # print(test)

    db.close()
    # return Response(dumps({"nodes": nodes, "links": temp}),
    #                 mimetype="application/json")

#
# @app.route( apiPrefix + '/question', methods=['POST'])
# def query():
#     data = request.get_data(as_text = True)
#     print(data)
#     # question = request.form.to_dict().get("question", "")
#     # question = '进程包含线程吗？'
#     if data:
#         answer, node= question_solve.Solve().query(data)
#         # print(answer)
#         # s = '包含'
#         # for data in answer:
#         #     s = s+str(data)+'，'
#     else:
#         answer = "Sorry, I can't understand what you say."
#
#     print(answer)
#     print(node)
#     return Response(dumps({"answer": answer, 'node' : node}),
#                     mimetype="application/json")


@app.route( apiPrefix + '/whole')
def get_whole():
    # path = './src/records.json'
    # with open('./src/records.json','r',encoding='utf_8_sig')as f:
        # json_data = json.load(f)
        # print(json_data)
    return send_from_directory('./src','records_path.json')

@app.route( apiPrefix + '/get_address')
def get_address():
    # db = GraphDB(url,username,password)
    # res = db.get_address()
    # return res
    #Response(dumps({"node": res[0]}), mimetype="application/json")
    return send_from_directory('./src','records_address.json')




@app.route( apiPrefix + '/search_address', methods=['POST'])
@cross_origin()
def search_address():
    data = request.get_data(as_text=True)
    # 查询参数
    params = json.loads(data)
    print('获取数据:', params)
    # return params
    try:
        # TODO : 根据params 完成查询函数 返回节点和边数据 参考 graph.py search_graph return nodes links
        db = GraphDB(url, username, password)
        res = db.search_address(params)
        db.close()
        return Response(dumps({"res": res}),
                        mimetype="application/json")
    except json.JSONDecodeError:
        return jsonify({"error": "无效的 JSON 数据"}), 400


@app.route( apiPrefix + '/search_address_number', methods=['POST'])
@cross_origin()
def search_address_number():
    data = request.get_data(as_text=True)
    # 查询参数
    params = json.loads(data)
    print('获取数据:', params)
    # return params
    try:
        # TODO : 根据params 完成查询函数 返回节点和边数据 参考 graph.py search_graph return nodes links
        db = GraphDB(url, username, password)
        res = db.search_address_number(params)
        db.close()
        return Response(dumps(res),
                        mimetype="application/json")
    except json.JSONDecodeError:
        return jsonify({"error": "无效的 JSON 数据"}), 400




@app.route( apiPrefix + '/nodeid', methods=['POST'])
@cross_origin()
def get_nodeid():
    data = request.get_data(as_text = True)
    # id = data.replace('"','')
    # 解析 JSON 数据
    try:
        node_data = json.loads(data)
    except json.JSONDecodeError:
        return jsonify({"error": "无效的 JSON 数据"}), 400
    id = node_data.get('id', None)
    if id is None:
        return jsonify({"error": "JSON 数据中未找到 ID"}), 400
    print('获取数据:', data)
    db = GraphDB(url,username,password)
    res = db.search_nodeid(int(id))
    print(res)
    return Response(dumps({"node": res[0]}),
                    mimetype="application/json")



# @app.route( apiPrefix + '/node1', methods=['POST'])
# def get_node1():
#     # 获取请求数据，并将其转换为文本格式
#     data = request.get_data(as_text=True)
#     print('接收到的数据：', data)
#     # 解析 JSON 数据
#     try:
#         node_data = json.loads(data)
#     except json.JSONDecodeError:
#         return jsonify({"error": "无效的 JSON 数据"}), 400
#     # 获取 JSON 数据中的 ID 并转换为整数
#     id = node_data.get('id', None)
#     if id is None:
#         return jsonify({"error": "JSON 数据中未找到 ID"}), 400
#     # 模拟数据库操作，这里使用列表存储节点信息
#     nodes = [
#         {"id": 1, "name": "节点 1"},
#         {"id": 2, "name": "节点 2"},
#         {"id": 3, "name": "节点 3"},
#     ]
#     # 查找节点信息
#     node = next((n for n in nodes if n['id'] == int(id)), None)
#     if node:
#         return jsonify({"node": node})
#     else:
#         return jsonify({"error": "未找到节点"}), 404


if __name__ == '__main__':
    app.run(debug = True)