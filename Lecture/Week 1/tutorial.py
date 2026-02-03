#Step 1: Data preparation in flie data.txt which is stored in file system

# Step 2: Initialize the dictionary
city_map = {}

# Step 3: Open and read the file
with open('data.txt', 'r') as file:
    for line in file:
        # Remove whitespace and split by single space
        parts = line.strip().split(' ')
        
        # Assign parts to descriptive variables
        # Based on tutorial: 1.From, 2.To, 3.Actual, 4.Straight-line
        from_city = parts[0]
        to_city = parts[1]
        actual_dist = int(parts[2])    # Convert to integer for data processing
        straight_dist = int(parts[3])  # Convert to integer
        
        # Create the tuple for the destination info
        destination_data = (to_city, actual_dist, straight_dist)
        
        # Step 4: Populate the dictionary
        if from_city not in city_map:
            # If city is new, create a list with this first destination
            city_map[from_city] = [destination_data]
        else:
            # If city exists, add this destination to the list
            city_map[from_city].append(destination_data)

# Print the result to verify
for city, connections in city_map.items():
    print(f"{city}: {connections}")