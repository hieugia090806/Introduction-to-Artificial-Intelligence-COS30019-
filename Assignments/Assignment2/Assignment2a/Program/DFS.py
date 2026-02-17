#Import crucial libraries
import os
import networkx as nx
import matplotlib.pyplot as plt
#--Data Parsing (File Reading)--#
def load_data():
    nodes_pos = {} 
    edges = []
    start_node = None
    goal_nodes = []
    
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
                edges.append((u, v))
                
    return nodes_pos, edges, start_node, goal_nodes
#--Depth-First Search (DFS) Implementation--#
def dfs_algorithm(graph, start, goals):
    frontier = [(start, [start])] # Stack storage (current node, paths have visited)
    visited = set()               # Set for nodes to avoid loop back
    
    while frontier:
        current_node, path = frontier.pop() # LIFO: pop from the end of the list (stack behavior)
        
        if current_node in goals:
            return path # Return the path to the goal if found
            
        if current_node not in visited:
            visited.add(current_node)
            neighbors = list(graph.neighbors(current_node))
            # Sort neighbors in reverse order to ensure consistent traversal order (optional)
            for neighbor in sorted(neighbors, reverse=True):
                if neighbor not in visited:
                    frontier.append((neighbor, path + [neighbor]))
    return None
#--Displays the Graph--#
nodes_pos, edges, start, goals = load_data()
G = nx.Graph()
G.add_edges_from(edges)

result_path = dfs_algorithm(G, start, goals)

fig, ax = plt.subplots(figsize=(8, 6))

nx.draw(G, 
        pos=nodes_pos, 
        with_labels=True, 
        node_color='skyblue',  
        edge_color='black',    
        width=1.5, 
        node_size=800, 
        font_weight='bold',
        ax=ax)

if result_path:
    path_edges = list(zip(result_path, result_path[1:]))
    
    nx.draw_networkx_edges(G, 
                           pos=nodes_pos, 
                           edgelist=path_edges, 
                           edge_color='red',
                           width=4,          
                           ax=ax)

# Cấu hình Oxy
ax.set_axis_on() 
ax.tick_params(left=True, bottom=True, labelleft=True, labelbottom=True)
plt.grid(True, linestyle='--', alpha=0.5)
plt.title("DFS Final Path Showcase")
plt.xlabel("X Coordinate")
plt.ylabel("Y Coordinate")

plt.show()
#--DFS Metrics Calculation--#
def dfs_with_metrics(graph, start, goals):
    frontier = [(start, [start])]
    visited = set()
    total_nodes_in_graph = len(graph.nodes)
    
    while frontier:
        current_node, path = frontier.pop()
        
        if current_node in goals:
            # --- METRICS CALCULATION ---
            path_length = len(path)
            nodes_explored = len(visited) + 1
            success_rate = 100.0 
            
            # Search space exploration ratio: (nodes explored / total nodes in graph) * 100
            exploration_ratio = (nodes_explored / total_nodes_in_graph) * 100
            
            return {
                "path": path,
                "path_length": path_length,
                "nodes_explored": nodes_explored,
                "success_rate": success_rate,
                "exploration_ratio": f"{exploration_ratio:.2f}%"
            }
            
        if current_node not in visited:
            visited.add(current_node)
            neighbors = list(graph.neighbors(current_node))
            for neighbor in sorted(neighbors, reverse=True):
                if neighbor not in visited:
                    frontier.append((neighbor, path + [neighbor]))
    return None

# --Table of Metrics Display--
metrics = dfs_with_metrics(G, start, goals)

if metrics:
    print("--- DFS PERFORMANCE SHOWCASE ---")
    print(f"1. Success Rate: {metrics['success_rate']}%")
    print(f"2. Nodes Explored: {metrics['nodes_explored']} nodes")
    print(f"3. Path Found Length: {metrics['path_length']} nodes")
    print(f"4. Exploration Ratio: {metrics['exploration_ratio']}")
    print(f"5. Path Optimality: Non-Optimal (DFS finds the first path, not the shortest)")