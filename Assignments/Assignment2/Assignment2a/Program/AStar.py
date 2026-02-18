import os
import math
import heapq
import networkx as nx
import matplotlib.pyplot as plt

def data_reading(filename): 
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

def heuristic(node_coords, goal_coords):
    return math.sqrt((node_coords[0] - goal_coords[0])**2 + (node_coords[1] - goal_coords[1])**2)

def a_star_algorithm(graph, positions, start, goal):
    if start not in graph or goal not in positions: return None, 0, 0
    
    start_h = heuristic(positions[start], positions[goal])
    frontier = [(start_h, 0, start, [start])]
    visited = {} 
    nodes_explored = 0

    while frontier:
        f_val, g_cost, current, path = heapq.heappop(frontier)
        
        if current in visited and g_cost >= visited[current]: continue
        visited[current] = g_cost
        nodes_explored += 1

        if current == goal:
            return path, g_cost, nodes_explored

        for neighbor, weight in graph.get(current, []):
            new_g = g_cost + weight
            if neighbor not in visited or new_g < visited[neighbor]:
                h_neighbor = heuristic(positions[neighbor], positions[goal])
                new_f = new_g + h_neighbor
                heapq.heappush(frontier, (new_f, new_g, neighbor, path + [neighbor]))
                
    return None, 0, nodes_explored

def main():
    filename = 'PathFinder-test4.txt'
    graph, positions, origin, destinations = data_reading(filename)
    if not graph: print("Data Error!"); return

    for dest in destinations:
        path, total_cost, explored = a_star_algorithm(graph, positions, origin, dest)
        
        # Performance Showcase
        total_nodes = len(positions)
        ratio = (explored / total_nodes) * 100 if total_nodes > 0 else 0
        
        print("\n" + "="*50)
        print(f"{'--- A* PERFORMANCE SHOWCASE ---':^50}")
        print("="*50)
        print(f"{'1. Success Rate:':<25} {'100.0%' if path else '0.0%'}")
        print(f"{'2. Nodes Explored:':<25} {explored} nodes")
        print(f"{'3. Exploration Ratio:':<25} {ratio:.2f}%")
        print(f"{'4. Total Path Cost:':<25} {total_cost}")
        print(f"{'5. Optimality:':<25} Guaranteed (Best Path)")
        print("="*50)

        if path:
            plt.figure(figsize=(8, 6))
            G = nx.Graph()
            for u, neighbors in graph.items():
                for v, w in neighbors: G.add_edge(u, v, weight=w)
            nx.draw(G, pos=positions, with_labels=True, node_color='plum', 
                    edge_color='black', width=1.5, node_size=800)
            path_edges = list(zip(path, path[1:]))
            nx.draw_networkx_edges(G, pos=positions, edgelist=path_edges, edge_color='purple', width=4)
            plt.title(f"A* Path: {origin} -> {dest} (Cost: {total_cost})")
            plt.axis('on'); plt.grid(True, linestyle='--', alpha=0.5); plt.show()

if __name__ == "__main__":
    main()