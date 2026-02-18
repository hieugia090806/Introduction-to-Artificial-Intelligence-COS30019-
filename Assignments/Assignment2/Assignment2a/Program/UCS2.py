#--Importing--#
import os
import heapq
import networkx as nx
import matplotlib.pyplot as plt

#--1. Data Parsing (Gamble's Standard Parser)--#
def data_parsing(filename):
    graph, positions, origin, destinations = {}, {}, None, []
    if not os.path.exists(filename): return graph, positions, origin, destinations
    with open(filename, 'r') as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]
    mode = ""
    for line in lines:
        if "Nodes" in line: mode = "nodes"; continue
        if "Edges" in line: mode = "edges"; continue
        if "Origin" in line: mode = "origin"; continue
        if "Destinations" in line: mode = "dest"; continue
        try:
            if mode == "nodes" and ":" in line:
                node, coord = line.split(":")
                positions[int(node)] = tuple(map(int, coord.strip()[1:-1].split(',')))
            elif mode == "edges" and ":" in line:
                edge_part = line.split(":")[0].strip().replace("(", "").replace(")", "")
                u, v = map(int, edge_part.split(','))

                weight = int(line.split(":")[1].strip()) if ":" in line else 1
                graph.setdefault(u, []).append((v, weight))
                graph.setdefault(v, []).append((u, weight))
            elif mode == "origin": origin = int(line)
            elif mode == "dest": destinations = [int(x.strip()) for x in line.replace(';', ' ').split()]
        except: continue
    return graph, positions, origin, destinations

#--2. UCS Level 2 Algorithm--#
def ucs_level2(graph, start, goal):
    if start not in graph: return None, 0, 0
    
    frontier = [(0, start, [start])]
    visited = {} 
    nodes_explored = 0

    while frontier:
        cost, current, path = heapq.heappop(frontier)
        

        if current in visited and cost >= visited[current]: continue
        visited[current] = cost
        nodes_explored += 1

        if current == goal:
            return path, cost, nodes_explored

        for neighbor, weight in graph.get(current, []):
            new_cost = cost + weight
            if neighbor not in visited or new_cost < visited[neighbor]:
                heapq.heappush(frontier, (new_cost, neighbor, path + [neighbor]))
                
    return None, 0, nodes_explored

#--3. Main Execution--#
def main():
    filename = 'PathFinder-test3.txt'
    graph, positions, origin, destinations = data_parsing(filename)
    if not graph: print("Data Error!"); return

    print(f"Starting UCS Level 2 for Origin: {origin}")

    for dest in destinations:
        path, total_cost, explored = ucs_level2(graph, origin, dest)
        
        total_nodes = len(positions)
        ratio = (explored / total_nodes) * 100 if total_nodes > 0 else 0
        
        print("\n" + "="*50)
        print(f"{'--- UCS LEVEL 2 SHOWCASE ---':^50}")
        print(f"{'Goal Node: ' + str(dest):^50}")
        print("="*50)
        print(f"{'1. Success Rate:':<25} {'100.0%' if path else '0.0%'}")
        print(f"{'2. Nodes Explored:':<25} {explored} nodes")
        print(f"{'3. Exploration Ratio:':<25} {ratio:.2f}%")
        print(f"{'4. Optimal Path Cost:':<25} {total_cost}") 
        print(f"{'5. Algorithm Property:':<25} Complete & Optimal")
        print("="*50)

        if path:
            plt.figure(figsize=(8, 6))
            G = nx.Graph()
            for u, neighbors in graph.items():
                for v, w in neighbors: G.add_edge(u, v, weight=w)
            
            nx.draw(G, pos=positions, with_labels=True, node_color='lightcoral', 
                    edge_color='black', width=1.2, node_size=800)
            
            path_edges = list(zip(path, path[1:]))
            nx.draw_networkx_edges(G, pos=positions, edgelist=path_edges, edge_color='blue', width=4)
            
            plt.title(f"UCS Level 2 Path: {origin} -> {dest} (Cost: {total_cost})")
            plt.axis('on'); plt.grid(True, linestyle='--', alpha=0.5); plt.show()

if __name__ == "__main__":
    main()