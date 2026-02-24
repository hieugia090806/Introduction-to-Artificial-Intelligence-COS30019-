#--Import libraries--#
import math
import re
#--Core Functions--#
def heuristic(node, goal, positions):
    (x1, y1) = positions[node]
    (x2, y2) = positions[goal]
    return math.sqrt((x1 - x2)**2 + (y1 - y2)**2)

def search_recursive(path, g, threshold, goal, graph, positions, explored_set):
    node = path[-1]
    f = g + heuristic(node, goal, positions)
    if f > threshold: return f, False
    
    explored_set.add(node)
    if node == goal: return g, True
    
    min_threshold = float('inf')
    for neighbor, weight in graph.get(node, []):
        if neighbor not in path:
            path.append(neighbor)
            res, found = search_recursive(path, g + weight, threshold, goal, graph, positions, explored_set)
            if found: return res, True
            if res < min_threshold: min_threshold = res
            path.pop()
    return min_threshold, False

def ida_star_algorithm(graph, positions, start, goal):
    threshold = heuristic(start, goal, positions)
    path = [start]
    all_explored_nodes = set()
    while True:
        res, found = search_recursive(path, 0, threshold, goal, graph, positions, all_explored_nodes)
        if found: return path, len(all_explored_nodes), res
        if res == float('inf'): return None, len(all_explored_nodes), 0
        threshold = res

#--MAIN FUNCTION--#
def main():
    file_name = "PathFinder-test1.txt"
    positions = {}
    graph = {}
    origin = None
    destinations = []

    try:
        with open(file_name, "r") as f:
            content = f.read()
            
            nodes_data = re.findall(r"(\d+):\s*\(([\d.]+),\s*([\d.]+)\)", content)
            for node, x, y in nodes_data:
                positions[node] = (float(x), float(y))
            
            edges_data = re.findall(r"\((\d+),(\d+)\):\s*([\d.]+)", content)
            for u, v, w in edges_data:
                if u not in graph: graph[u] = []
                graph[u].append((v, float(w)))
            
            origin_match = re.search(r"Origin:\s*(\d+)", content)
            if origin_match: origin = origin_match.group(1)
            
            dest_match = re.search(r"Destinations:\s*([\d;\s]+)", content)
            if dest_match:
                destinations = [d.strip() for d in dest_match.group(1).replace(';', ' ').split()]

        if origin and destinations:
            goal = destinations[0]
            print(f"--- Running IDA* from Node {origin} to Node {goal} ---")
            path, nodes_count, cost = ida_star_algorithm(graph, positions, origin, goal)
            
            if path:
                print(f"1. Nodes Explored: {nodes_count}")
                print(f"2. Total Cost: {cost:.2f}")
                print(f"3. Path: {' -> '.join(path)}")
            else:
                print("No path found.")
        else:
            print("Error: Could not find Origin or Destinations in file.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()