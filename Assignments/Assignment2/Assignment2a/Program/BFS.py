#--Importing--#
import os
import networkx as nx
import matplotlib.pyplot as plt
from collections import deque

#--1. Data Parsing (Improved Robustness)--#
def data_parsing(filename):
    graph, positions, origin, destinations = {}, {}, None, []
    if not os.path.exists(filename):
        print(f"File not found: {filename}")
        return graph, positions, origin, destinations

    with open(filename, 'r') as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]

    mode = ""
    for line in lines:
        # Nhận diện Mode linh hoạt hơn
        if "Nodes" in line: mode = "nodes"; continue
        if "Edges" in line: mode = "edges"; continue
        if "Origin" in line: mode = "origin"; continue
        if "Destinations" in line: mode = "dest"; continue

        try:
            if mode == "nodes" and ":" in line:
                node, coord = line.split(":")
                # Xử lý tọa độ (x,y) hoặc (x, y)
                clean_coord = coord.strip().replace("(", "").replace(")", "")
                positions[int(node)] = tuple(map(int, clean_coord.split(',')))
            elif mode == "edges" and ":" in line:
                # Xử lý cạnh (u,v)
                edge_part = line.split(":")[0].strip().replace("(", "").replace(")", "")
                u, v = map(int, edge_part.split(','))
                graph.setdefault(u, []).append(v)
                graph.setdefault(v, []).append(u)
            elif mode == "origin":
                origin = int(line)
            elif mode == "dest":
                # Chấp nhận cả dấu ; hoặc dấu cách
                destinations = [int(x.strip()) for x in line.replace(';', ' ').split()]
        except ValueError:
            continue # Bỏ qua dòng lỗi định dạng
            
    return graph, positions, origin, destinations

#--2. BFS Algorithm--#
def bfs_algorithm(graph, start, goal):
    if start not in graph: return None, 0
    queue = deque([[start]])
    visited = {start}
    nodes_explored = 0

    while queue:
        path = queue.popleft()
        node = path[-1]
        nodes_explored += 1

        if node == goal:
            return path, nodes_explored

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])
    return None, nodes_explored

#--3. Main Execution--#
def main():
    # Kiểm tra tên file chính xác của bạn
    filename = 'PathFinder-test1.txt' 
    graph, positions, origin, destinations = data_parsing(filename)
    
    if not graph or origin is None: 
        print("Data Error: Could not parse Graph or Origin!"); return

    for dest in destinations:
        path, explored = bfs_algorithm(graph, origin, dest)
        
        # In bảng giống hệt image_242760.png
        total_nodes = len(positions)
        print("\n" + "-"*5 + " BFS PERFORMANCE SHOWCASE " + "-"*5)
        print(f"1. Success Rate: {'100.0%' if path else '0.0%'}")
        print(f"2. Nodes Explored: {explored} nodes")
        print(f"3. Path Found Length: {len(path) if path else 0} nodes")
        print(f"4. Exploration Ratio: {(explored/total_nodes)*100:.2f}%" if total_nodes > 0 else "4. Exploration Ratio: 0%")
        
        # Vẽ hình
        if path:
            plt.figure(figsize=(7, 6))
            G = nx.Graph()
            # Đảm bảo tất cả node có trong hình dù không có cạnh
            for n in positions: G.add_node(n)
            for u, neighbors in graph.items():
                for v in neighbors: G.add_edge(u, v)
            
            nx.draw(G, pos=positions, with_labels=True, node_color='skyblue', 
                    edge_color='black', width=1.5, node_size=800)
            
            path_edges = list(zip(path, path[1:]))
            nx.draw_networkx_edges(G, pos=positions, edgelist=path_edges, edge_color='red', width=4)
            
            plt.title(f"BFS Path: {origin} -> {dest}")
            plt.axis('on')
            plt.grid(True, linestyle='--', alpha=0.5)
            plt.show()

if __name__ == "__main__":
    main()