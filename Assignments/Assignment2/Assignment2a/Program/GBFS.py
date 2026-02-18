#--Step 1L Import Python libraries--#
import os
import math
import heapq
import networkx as nx 
import matplotlib.pyplot as plt
#--Step 2: Data Parsinf (Read Data from File)--#
def read_data(filename):
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
                u, v = map(int, line.split(":")[0].strip()[1:-1].split(','))
                graph.setdefault(u, []).append(v)
                graph.setdefault(v, []).append(u)
            elif mode == "origin": origin = int(line)
            elif mode == "dest": destinations = [int(x.strip()) for x in line.replace(';', ' ').split()]
        except: continue
    return graph, positions, origin, destinations
#--Step 3: Heuristic Function (Euclidean Distance)--#
def heuristic(node_coords, goal_coords):
    return math.sqrt((node_coords[0] - goal_coords[0])**2 + (node_coords[1] - goal_coords[1])**2)
#--3. GBFS Algorithm--#
def gbfs_algorithm(graph, positions, start, goal):
    if start not in graph or goal not in positions: return None, 0
    
    # Priority Queue stores: (h(n), current_node, path)
    # GBFS only cares about h(n) - the distance to the destination
    start_h = heuristic(positions[start], positions[goal])
    frontier = [(start_h, start, [start])]
    visited = set()
    nodes_explored = 0

    while frontier:
        h_val, current, path = heapq.heappop(frontier)
        
        if current in visited: continue
        visited.add(current)
        nodes_explored += 1

        if current == goal:
            return path, nodes_explored

        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                h_neighbor = heuristic(positions[neighbor], positions[goal])
                heapq.heappush(frontier, (h_neighbor, neighbor, path + [neighbor]))
                
    return None, nodes_explored
#--4. Main Execution--#
def main():
    filename = 'PathFinder-test4.txt'
    graph, positions, origin, destinations = read_data(filename)
    
    if not graph: print("Data Error!"); return

    for dest in destinations:
        path, explored = gbfs_algorithm(graph, positions, origin, dest)
        total_nodes = len(positions)
        exploration_ratio = (explored / total_nodes) * 100 if total_nodes > 0 else 0
        success_rate = 100.0 if os.path else 0.0
        
        print("\n" + "="*50)
        print(f"{'--- GBFS PERFORMANCE SHOWCASE ---':^50}")
        print("="*50)
        print(f"{'1. Success Rate:':<25} {'100%' if path else '0%'}")
        print(f"{'2. Nodes Explored:':<25} {explored} nodes")
        print(f"{'3. Path Length:':<25} {len(path) if path else 0} nodes")
        print(f"{'4. Exploration Ratio:':<25} {exploration_ratio:.2f}%")
        print(f"{'5. Heuristic Used:':<25} Euclidean Distance")
        print(f"{'6. Strategy:':<25} Greedy (Best-First)")
        print("="*50)

        # Draw the graph and the path
        if path:
            plt.figure(figsize=(8, 6))
            G = nx.Graph()
            for u, neighbors in graph.items():
                for v in neighbors: G.add_edge(u, v)
            nx.draw(G, pos=positions, with_labels=True, node_color='lightgreen', 
                    edge_color='black', width=1.5, node_size=800)
            path_edges = list(zip(path, path[1:]))
            nx.draw_networkx_edges(G, pos=positions, edgelist=path_edges, edge_color='green', width=4)
            plt.title(f"GBFS Path: {origin} -> {dest}")
            plt.axis('on')
            plt.grid(True, linestyle='--', alpha=0.5)
            plt.show()

if __name__ == "__main__":
    main()