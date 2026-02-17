#--Import critical libraries--#
import os
import heapq
import networkx as nx
import matplotlib.pyplot as plt

#--Data Parsing (File Reading)--#
def load_data():
    nodes_pos = {} 
    edges = [] 
    start_node = None
    goal_nodes = []
    
    # Hãy đảm bảo file 'PathFinder-test1.txt' tồn tại
    with open('PathFinder-test4.txt', 'r') as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]

    mode = ""
    for i, line in enumerate(lines):
        if "Nodes" in line: mode = "nodes"
        elif "Edges" in line: mode = "edges"
        elif "Origin:" in line: start_node = int(lines[i+1])
        elif "Destinations:" in line:
            goal_nodes = [int(x.strip()) for x in lines[i+1].split(';') if x.strip()]
        else:
            if mode == "nodes" and ":" in line:
                node_id = int(line.split(':')[0])
                coords = tuple(map(int, line.split('(')[1].split(')')[0].split(',')))
                nodes_pos[node_id] = coords
            elif mode == "edges" and ":" in line:
                edge_part = line.split(':')[0][1:-1] 
                u, v = map(int, edge_part.split(','))
                weight = int(line.split(':')[1].strip()) 
                edges.append((u, v, weight))
                
    return nodes_pos, edges, start_node, goal_nodes

#--Uniform Cost Search (UCS) Implementation with Metrics--#
def ucs_algorithm(graph, start, goals):
    frontier = [(0, start, [start])]
    visited = {} 
    nodes_explored_count = 0 # Đếm số node đã duyệt để đưa vào bảng

    while frontier:
        cost, current, path = heapq.heappop(frontier)

        if current in goals:
            return path, cost, nodes_explored_count + 1

        if current not in visited or cost < visited[current]:
            visited[current] = cost
            nodes_explored_count += 1 # Mỗi lần mở rộng một node mới
            
            for neighbor in graph.neighbors(current):
                weight = graph[current][neighbor].get('weight', 1)
                new_cost = cost + weight
                if neighbor not in visited or new_cost < visited[neighbor]:
                    heapq.heappush(frontier, (new_cost, neighbor, path + [neighbor]))
                    
    return None, 0, nodes_explored_count

#--Main Execution and Visualization--#
nodes_pos, edges, start, goals = load_data()
G = nx.Graph()
for u, v, w in edges:
    G.add_edge(u, v, weight=w)

# 1. Run UCS and collect data
result_path, total_cost, explored_count = ucs_algorithm(G, start, goals)

# 2. Display the Performance Showcase Table (The part you requested)
total_nodes = len(G.nodes)
success_rate = 100.0 if result_path else 0.0
exploration_ratio = (explored_count / total_nodes) * 100 if total_nodes > 0 else 0

print("\n" + "="*50)
print(f"{'--- UCS PERFORMANCE SHOWCASE ---':^50}")
print("="*50)
print(f"{'1. Success Rate:':<25} {success_rate}%")
print(f"{'2. Nodes Explored:':<25} {explored_count} nodes")
print(f"{'3. Path Found Length:':<25} {len(result_path) if result_path else 0} nodes")
print(f"{'4. Exploration Ratio:':<25} {exploration_ratio:.2f}%")
print(f"{'5. Total Path Cost:':<25} {total_cost}")
print("="*50)
print(f"Optimal Path found: {result_path}")
print("="*50 + "\n")

# 3. Visualization
fig, ax = plt.subplots(figsize=(8, 6))
nx.draw(G, pos=nodes_pos, with_labels=True, node_color='skyblue', 
        edge_color='black', width=1.5, node_size=800, font_weight='bold', ax=ax)

if result_path:
    path_edges = list(zip(result_path, result_path[1:]))
    nx.draw_networkx_edges(G, pos=nodes_pos, edgelist=path_edges, 
                           edge_color='blue', width=4, ax=ax)

ax.set_axis_on()
ax.tick_params(left=True, bottom=True, labelleft=True, labelbottom=True)
plt.grid(True, linestyle='--', alpha=0.5)
plt.title(f"UCS Optimal Path (Total Cost: {total_cost})")
plt.xlabel("X Coordinate")
plt.ylabel("Y Coordinate")

plt.show()