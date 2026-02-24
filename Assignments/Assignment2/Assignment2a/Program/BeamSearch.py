#--Python Libraries--#
import math
import heapq
import re
#--The Heuristic and Core Logic--#
def heuristic(node, goal, positions):
    (x1, y1) = positions[node]
    (x2, y2) = positions[goal]
    return math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
#--Beam Search Implementation--#
def beam_search(graph, positions, start, goal, k=2):
    beam = [(heuristic(start, goal, positions), start, [start], 0)]
    nodes_explored = 0

    while beam:
        candidates = []
        nodes_explored += len(beam)
        
        for _, current, path, g_cost in beam:
            if current == goal:
                return path, nodes_explored, g_cost
            #--Node Neighbors--#
            for neighbor, weight in graph.get(current, []):
                if neighbor not in path:
                    new_path = path + [neighbor]
                    new_g = g_cost + weight
                    h = heuristic(neighbor, goal, positions)
                    candidates.append((h, neighbor, new_path, new_g))
        #--Beam Width--#
        beam = heapq.nsmallest(k, candidates, key=lambda x: x[0])
    return None, nodes_explored, 0
#--Main--#
def main():
    file_name = "PathFinder-test1.txt"
    positions = {}
    graph = {}
    origin = None
    destinations = []

    print("-----------------------------------------------")
    print(f"   BEAM SEARCH SYSTEM - TEAM GAMBLE")
    print("---------------------------------------------\n")

    try:
        with open(file_name, "r") as f:
            content = f.read()
            
            # Step A: Parse Nodes using Regex -> 1: (4,1)
            nodes_data = re.findall(r"(\d+):\s*\(([\d.]+),\s*([\d.]+)\)", content)
            for node, x, y in nodes_data:
                positions[node] = (float(x), float(y))
            
            # Step B: Parse Edges using Regex -> (2,1): 4
            edges_data = re.findall(r"\((\d+),(\d+)\):\s*([\d.]+)", content)
            for u, v, w in edges_data:
                if u not in graph: graph[u] = []
                graph[u].append((v, float(w)))
            
            # Step C: Parse Origin and Destinations (Handling ';' in file)
            origin_match = re.search(r"Origin:\s*(\d+)", content)
            if origin_match: origin = origin_match.group(1)
            
            dest_match = re.search(r"Destinations:\s*([\d;\s]+)", content)
            if dest_match:
                dest_str = dest_match.group(1).replace(';', ' ')
                destinations = [d.strip() for d in dest_str.split() if d.strip()]

        # Validate file data
        if not origin or not destinations:
            print("Error: Could not find Origin or Destinations in the file.")
            return

        # Execute Search (Testing with the first Destination)
        goal_node = destinations[0]
        k_width = 2 # Beam Width
        
        path, explored_count, total_cost = beam_search(graph, positions, origin, goal_node, k=k_width)

        # Output Results in a format matching your Performance Showcase Table
        print(f"--- RESULTS (Beam Width k={k_width}) ---")
        if path:
            # Calculation for report metrics
            exp_ratio = (explored_count / len(positions)) * 100
            
            print(f"1. Success Rate:      100.0%")
            print(f"2. Nodes Explored:    {explored_count} nodes")
            print(f"3. Exploration Ratio: {exp_ratio:.2f}%")
            print(f"4. Total Path Cost:   {total_cost:.2f}")
            print(f"5. Optimality:        Limited by k={k_width}")
            print(f"Final Path: {' -> '.join(path)}")
        else:
            print(f"No path found to Node {goal_node} within the specified beam width.")

    except FileNotFoundError:
        print(f"Error: File '{file_name}' not found. Please place it in the script directory.")
    except Exception as e:
        print(f"Unexpected Error: {e}")
    print("\n-----------------------------------------------")

if __name__ == "__main__":
    main()