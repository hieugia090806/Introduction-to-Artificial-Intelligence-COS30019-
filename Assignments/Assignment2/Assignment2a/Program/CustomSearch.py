#--In custome search, my team decide to utilize the Beam Search algorithm--#
#--Python Libraries--#
import math
import heapq
import re
import matplotlib.pyplot as plt

#--The Heuristic and Core Logic--#
def heuristic(node, goal, positions):
    (x1, y1) = positions[node]
    (x2, y2) = positions[goal]
    return math.sqrt((x1 - x2)**2 + (y1 - y2)**2)

#--Beam Seach Implementation--#
def beam_search(graph, positions, start, goal, k=2):
    # Initial beam: (heuristic, current_node, path, g_cost)
    beam = [(heuristic(start, goal, positions), start, [start], 0)]
    nodes_explored = 0

    while beam:
        candidates = []
        nodes_explored += len(beam)
        for _, current, path, g_cost in beam:
            if current == goal:
                return path, nodes_explored, g_cost
            #--Explore Neighbors--#
            for neighbor, weight in graph.get(current, []):
                if neighbor not in path:
                    new_path = path + [neighbor]
                    new_g = g_cost + weight
                    h = heuristic(neighbor, goal, positions)
                    candidates.append((h, neighbor, new_path, new_g))
        #--Beam Width Pruning--#
        beam = heapq.nsmallest(k, candidates, key=lambda x: x[0])
    return None, nodes_explored, 0
#--Advanced Visualization Logic--#
def draw_graph(positions, graph, path, goal_node, title="Beam Search Visualization"):
    plt.figure(figsize=(12, 8))
    #--Draw all edges--#
    for u in graph:
        for v, _ in graph[u]:
            plt.plot([positions[u][0], positions[v][0]], 
                     [positions[u][1], positions[v][1]], 
                     'gray', linestyle='--', alpha=0.3, zorder=1)
    #--Draw all nodes--#
    for node, (x, y) in positions.items():
        color = 'skyblue'
        if path and node == path[0]: color = 'yellow' # Start
        elif node == goal_node: color = 'red' # Goal
        
        plt.scatter(x, y, s=500, color=color, edgecolors='black', zorder=3)
        plt.text(x, y, node, fontsize=9, fontweight='bold', ha='center', va='center', zorder=4)
    #--Highlight result path--#
    if path:
        px = [positions[n][0] for n in path]
        py = [positions[n][1] for n in path]
        plt.plot(px, py, color='green', linewidth=3, label=f"Path Found", zorder=2)

    plt.title(f"Gamble Team - {title}")
    plt.xlabel("X Coordinate")
    plt.ylabel("Y Coordinate")
    plt.grid(True, linestyle=':', alpha=0.5)
    plt.legend()
    plt.show()
#--Main Execution--#
def main():
    file_name = "PathFinder-test11.txt" 
    positions, graph, destinations = {}, {}, []
    origin = None

    print("-----------------------------------------------")
    print(f"   BEAM SEARCH SYSTEM - TEAM GAMBLE")
    print("---------------------------------------------\n")

    try:
        with open(file_name, "r") as f:
            content = f.read()
            
            #==Parse Nodes--#
            nodes_data = re.findall(r"([a-zA-Z0-9_]+):\s*\(([\d.-]+),\s*([\d.-]+)\)", content)
            for node, x, y in nodes_data: 
                positions[node] = (float(x), float(y))
            
            #--Parse Edges--#
            edges_data = re.findall(r"\(([a-zA-Z0-9_]+),([a-zA-Z0-9_]+)\):\s*([\d.]+)", content)
            for u, v, w in edges_data:
                if u not in graph: graph[u] = []
                graph[u].append((v, float(w)))
            
            #--Parse Origin and Destinations--#
            origin_match = re.search(r"Origin:\s*([a-zA-Z0-9_]+)", content)
            if origin_match: origin = origin_match.group(1)
            
            dest_match = re.search(r"Destinations:\s*([a-zA-Z0-9_;\s]+)", content)
            if dest_match:
                dest_str = dest_match.group(1).replace(';', ' ')
                destinations = [d.strip() for d in dest_str.split() if d.strip()]

        #--Validate Inputs--#
        if not origin or not destinations:
            print("Error: Could not parse Origin or Destinations. Check file format.")
            return

        goal_node = destinations[0]
        k_width = 2
        
        #--Execute Search--#
        path, explored_count, total_cost = beam_search(graph, positions, origin, goal_node, k=k_width)

        #--Advanced Metrics Calculation--#
        success_rate = 100.0 if path else 0.0
        exp_ratio = (explored_count / len(positions)) * 100 if len(positions) > 0 else 0

        print(f"--- PERFORMANCE SHOWCASE (k={k_width}) ---")
        if path:
            print(f"1. Status:            SUCCESS - Destination Reached")
            print(f"2. Success Rate:      {success_rate}%")
            print(f"3. Nodes Explored:    {explored_count} nodes")
            print(f"4. Exploration Ratio: {exp_ratio:.2f}%")
            print(f"5. Total Path Cost:   {total_cost:.2f}")
            print(f"6. Final Path:        {' -> '.join(path)}")
            
            #--Visualize the Result--#
            draw_graph(positions, graph, path, goal_node, f"Route from {origin} to {goal_node}")
        else:
            #--Advanced Diagnostics--#
            print(f"1. Status:            FAILED - Goal Unreachable")
            print(f"2. Success Rate:      {success_rate}%")
            print(f"3. Diagnostics:       No path found for '{goal_node}' with k={k_width}.")
            print(f"4. Progress:          Explored {explored_count} locations before failure.")

    except FileNotFoundError:
        print(f"Error: File '{file_name}' not found.")
    except Exception as e:
        print(f"System Error: {e}")
    
    print("\n-----------------------------------------------")

if __name__ == "__main__":
    main()