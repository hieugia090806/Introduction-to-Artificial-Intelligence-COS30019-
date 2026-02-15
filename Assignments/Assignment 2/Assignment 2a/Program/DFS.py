#Import crucial libraries
import networkx as nx
import matplotlib.pyplot as plt
import os
#Data Parsing (File reading)
def load_data():
    nodes_pos = {} # nodes_pos means nodes position
    edges = []
    start_node = None
    goal_nodes = []
    #open file
    with open('PathFinder-test3.txt', 'r') as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]

    mode = ""
    for i,line in enumerate(lines):
        if "Nodes" in line:
            mode = "nodes"
        elif "Edges" in line:
            mode = "edges"
        elif "Origin:" in line:
            start_node = int(lines[i+1])
        elif "Destinations:" in line:
            goal_nodes = [int(x.strip()) for x in lines[i+1].split(';') if x.strip()]
        else:
            # Xử lý dữ liệu dựa trên mode hiện tại
            if mode == "nodes" and ":" in line:
                node_id = int(line.split(':')[0])
                # Lấy phần trong ngoặc (4,1)
                coords = tuple(map(int, line.split('(')[1].split(')')[0].split(',')))
                nodes_pos[node_id] = coords
            elif mode == "edges" and ":" in line:
                # Lấy phần (2,1)
                edge_part = line.split(':')[0][1:-1]
                u, v = map(int, edge_part.split(','))
                edges.append((u, v))
                
    return nodes_pos, edges, start_node, goal_nodes
#Call to check
nodes_pos, edges, start, goals = load_data()
print("Nodes loaded:", nodes_pos)
print("Start node:", start)
#Initiliza the graph
G = nx.Graph()
G.add_edges_from(edges)

fig, ax = plt.subplots(figsize=(8, 6))
# The 'pos' parameter is crucial because it tells Python where to put each node
nx.draw(G, 
        pos=nodes_pos, 
        with_labels=True, 
        node_color='skyblue', 
        node_size=800, 
        font_weight='bold', 
        edge_color='gray',
        ax=ax)
# By default, networkx hides the axes. We turn them back on for the Oxy effect.
ax.set_axis_on() 
ax.tick_params(left=True, bottom=True, labelleft=True, labelbottom=True)

plt.grid(True, linestyle='--', alpha=0.5) # Adds a grid for better reading
plt.title("Depth-First Search, Graph Visualization on Oxy plane")
plt.xlabel("X Coordinate")
plt.ylabel("Y Coordinate")

plt.show()
#Depth-First Search (DFS) implementation
def dfs_algorithm(graph, start, goals):
    #Create stack with node start and list ndes has been visited
    frontier = [(start, [start])]
    visited = set()
    print(f"\n---Goal: Find the way from Node {start} to {goals} ---")
    #---Starting the DFS Searh algorithm---#
    while frontier:
        #Pop the last node in stack
        current_node, path = frontier.pop()
        #Check if reach the destination
        if current_node in goals:
            print(f"Goal {current_node} found with path: {path}")
            return path
        #If node has not visited
        if current_node not in visited:
            visited.add(current_node)
            print(f"Exploring: node {current_node}")
            neighbors = list(graph.neighbors(current_node))
            #Add neighbors to stack
            for neighbor in sorted(neighbors, reverse=True):
                if neighbor not in visited:
                    new_path = path + [neighbor]
                    frontier.append((neighbor, new_path))
    #If not find any path to goal
    return None
#Test the DFS algorithm
result = dfs_algorithm(G, start, goals)
print(f"Final Path found by Team Gamble: {result}")