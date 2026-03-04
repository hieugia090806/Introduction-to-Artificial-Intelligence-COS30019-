def parse_city_data(filename):
    city_map = {}

    with open(filename, 'r') as file:
        data = file.read().split()

    for i in range(0, len(data), 4):
        from_city = data[i]
        to_city = data[i+1]
        actual_dist = int(data[i+2])
        straight_dist = int(data[i+3])

        info = (to_city, actual_dist, straight_dist)
        if from_city not in city_map:
            city_map[from_city] = []
        city_map[from_city].append(info)

    return city_map

result = parse_city_data('data.txt')
print(result)