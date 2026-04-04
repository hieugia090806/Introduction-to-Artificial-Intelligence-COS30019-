import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { mlModelMetrics, searchAlgorithms } from "../data/mockData";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function Analytics() {
  // Model comparison data
  const modelComparison = Object.entries(mlModelMetrics).map(([name, metrics]) => ({
    name,
    MAE: metrics.mae,
    RMSE: metrics.rmse,
    MSE: metrics.mse,
    'R²': metrics.r2 * 100,
    'Training Time (s)': metrics.trainingTime,
  }));

  // Search algorithm performance
  const searchMetrics = searchAlgorithms.map(algo => ({
    ...algo,
    efficiency: (100 - algo.explorationRatio).toFixed(1),
  }));

  // Traffic flow vs speed data
  const flowSpeedData = [
    { flow: 0, speed: 60, category: "Free Flow" },
    { flow: 351, speed: 60, category: "Free Flow" },
    { flow: 500, speed: 55.2, category: "Under Capacity" },
    { flow: 750, speed: 48.1, category: "Under Capacity" },
    { flow: 1000, speed: 40.5, category: "Under Capacity" },
    { flow: 1250, speed: 34.2, category: "Near Capacity" },
    { flow: 1500, speed: 32, category: "At Capacity" },
    { flow: 1400, speed: 28.5, category: "Congested" },
    { flow: 1200, speed: 22.8, category: "Congested" },
    { flow: 1000, speed: 18.2, category: "Congested" },
  ];

  // Hourly traffic patterns
  const hourlyPatterns = [
    { hour: "00:00", weekday: 250, weekend: 180 },
    { hour: "03:00", weekday: 150, weekend: 120 },
    { hour: "06:00", weekday: 480, weekend: 220 },
    { hour: "07:00", weekday: 920, weekend: 340 },
    { hour: "08:00", weekday: 1350, weekend: 480 },
    { hour: "09:00", weekday: 1180, weekend: 620 },
    { hour: "12:00", weekday: 890, weekend: 780 },
    { hour: "15:00", weekday: 1100, weekend: 850 },
    { hour: "17:00", weekday: 1480, weekend: 920 },
    { hour: "18:00", weekday: 1420, weekend: 880 },
    { hour: "21:00", weekday: 680, weekend: 720 },
  ];

  // Algorithm radar data
  const algorithmRadar = [
    {
      metric: "Optimality",
      "A*": 100,
      "BFS": 100,
      "UCS": 100,
      "GBFS": 70,
      "Beam": 75,
      "DFS": 60,
    },
    {
      metric: "Speed",
      "A*": 70,
      "BFS": 50,
      "UCS": 60,
      "GBFS": 90,
      "Beam": 95,
      "DFS": 85,
    },
    {
      metric: "Memory",
      "A*": 60,
      "BFS": 40,
      "UCS": 55,
      "GBFS": 70,
      "Beam": 100,
      "DFS": 90,
    },
    {
      metric: "Completeness",
      "A*": 100,
      "BFS": 100,
      "UCS": 100,
      "GBFS": 80,
      "Beam": 70,
      "DFS": 85,
    },
  ];

  const getMetricIcon = (current: number, optimal: number) => {
    if (current < optimal * 0.95) return <TrendingDown className="h-4 w-4 text-red-500" />;
    if (current > optimal * 1.05) return <TrendingUp className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis and performance insights
        </p>
      </div>

      <Tabs defaultValue="ml-models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ml-models">ML Models</TabsTrigger>
          <TabsTrigger value="algorithms">Search Algorithms</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Patterns</TabsTrigger>
          <TabsTrigger value="system">System Performance</TabsTrigger>
        </TabsList>

        {/* ML Models Analytics */}
        <TabsContent value="ml-models" className="space-y-4">
          {/* Model Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Metrics</CardTitle>
              <CardDescription>
                Comparison of prediction accuracy across different ML models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                {Object.entries(mlModelMetrics).map(([name, metrics]) => (
                  <Card key={name}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{name}</CardTitle>
                        {name === "BLSTM" && (
                          <Badge variant="default">Best</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">R² Score</span>
                        <span className="font-bold">{metrics.r2.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">MAE</span>
                        <span className="font-medium">{metrics.mae.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">RMSE</span>
                        <span className="font-medium">{metrics.rmse.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Training Time</span>
                        <span className="font-medium">{metrics.trainingTime}s</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={modelComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar key="bar-mae" dataKey="MAE" fill="hsl(var(--chart-1))" name="MAE (lower is better)" />
                  <Bar key="bar-rmse" dataKey="RMSE" fill="hsl(var(--chart-2))" name="RMSE (lower is better)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* R² Score Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>R² Score Comparison</CardTitle>
              <CardDescription>
                Higher R² indicates better model fit (max = 1.0)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar key="bar-r2" dataKey="R²" fill="hsl(var(--chart-3))" name="R² Score (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Algorithms Analytics */}
        <TabsContent value="algorithms" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Algorithm Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Efficiency</CardTitle>
                <CardDescription>
                  Exploration ratio and nodes expanded comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={searchMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar key="bar-exploration" dataKey="explorationRatio" fill="hsl(var(--chart-1))" name="Exploration %" />
                    <Bar key="bar-nodes" dataKey="nodesExpanded" fill="hsl(var(--chart-2))" name="Nodes Expanded" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Characteristics</CardTitle>
                <CardDescription>
                  Multi-dimensional comparison of search strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={algorithmRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar 
                      key="radar-astar"
                      name="A*" 
                      dataKey="A*" 
                      stroke="hsl(var(--chart-1))" 
                      fill="hsl(var(--chart-1))" 
                      fillOpacity={0.3} 
                    />
                    <Radar 
                      key="radar-gbfs"
                      name="GBFS" 
                      dataKey="GBFS" 
                      stroke="hsl(var(--chart-2))" 
                      fill="hsl(var(--chart-2))" 
                      fillOpacity={0.3} 
                    />
                    <Radar 
                      key="radar-beam"
                      name="Beam" 
                      dataKey="Beam" 
                      stroke="hsl(var(--chart-3))" 
                      fill="hsl(var(--chart-3))" 
                      fillOpacity={0.3} 
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Algorithm Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Algorithm Analysis</CardTitle>
              <CardDescription>
                Performance metrics from Assignment 2A implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Algorithm</th>
                      <th className="text-right p-2 font-medium">Exploration Ratio</th>
                      <th className="text-right p-2 font-medium">Path Length</th>
                      <th className="text-right p-2 font-medium">Nodes Expanded</th>
                      <th className="text-left p-2 font-medium">Characteristics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchAlgorithms.map((algo) => (
                      <tr key={algo.name} className="border-b">
                        <td className="p-2 font-medium">{algo.name}</td>
                        <td className="text-right p-2">{algo.explorationRatio}%</td>
                        <td className="text-right p-2">{algo.pathLength}</td>
                        <td className="text-right p-2">{algo.nodesExpanded}</td>
                        <td className="p-2">
                          {algo.name === "A*" && <Badge variant="outline">Optimal</Badge>}
                          {algo.name === "BFS" && <Badge variant="outline">Complete</Badge>}
                          {algo.name === "Beam" && <Badge variant="outline">Memory-Efficient</Badge>}
                          {algo.name === "GBFS" && <Badge variant="outline">Fast</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Patterns Analytics */}
        <TabsContent value="traffic" className="space-y-4">
          {/* Flow vs Speed */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Flow to Speed Conversion</CardTitle>
              <CardDescription>
                Fundamental diagram: flow = -1.46(speed)² + 93.75(speed)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="flow" 
                    name="Flow" 
                    unit=" veh/hr"
                    label={{ value: 'Traffic Flow (vehicles/hour)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="speed" 
                    name="Speed" 
                    unit=" km/h"
                    label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter key="scatter-free" name="Free Flow" data={flowSpeedData.filter(d => d.category === "Free Flow")} fill="hsl(var(--chart-1))" />
                  <Scatter key="scatter-under" name="Under Capacity" data={flowSpeedData.filter(d => d.category === "Under Capacity")} fill="hsl(var(--chart-2))" />
                  <Scatter key="scatter-capacity" name="Near/At Capacity" data={flowSpeedData.filter(d => d.category.includes("Capacity"))} fill="hsl(var(--chart-3))" />
                  <Scatter key="scatter-congested" name="Congested" data={flowSpeedData.filter(d => d.category === "Congested")} fill="hsl(var(--chart-4))" />
                </ScatterChart>
              </ResponsiveContainer>

              <div className="mt-4 p-4 bg-muted rounded-lg space-y-2 text-sm">
                <h4 className="font-semibold">Key Observations:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Speed limit (60 km/h) maintained when flow ≤ 351 vehicles/hour</li>
                  <li>• Optimal capacity at 1500 vehicles/hour with speed of 32 km/h</li>
                  <li>• Congestion occurs when flow exceeds capacity (red curve)</li>
                  <li>• Two speeds possible for same flow rate (green vs red curve)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Hourly Patterns */}
          <Card>
            <CardHeader>
              <CardTitle>Hourly Traffic Patterns</CardTitle>
              <CardDescription>
                Weekday vs weekend traffic flow comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={hourlyPatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis label={{ value: 'Vehicles/hour', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    key="line-weekday"
                    type="monotone"
                    dataKey="weekday"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    name="Weekday"
                  />
                  <Line
                    key="line-weekend"
                    type="monotone"
                    dataKey="weekend"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    name="Weekend"
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Peak Hour (Weekday)</div>
                  <div className="text-2xl font-bold">17:00</div>
                  <div className="text-sm">1,480 veh/hr</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Peak Hour (Weekend)</div>
                  <div className="text-2xl font-bold">17:00</div>
                  <div className="text-sm">920 veh/hr</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Off-Peak</div>
                  <div className="text-2xl font-bold">03:00</div>
                  <div className="text-sm">120-150 veh/hr</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Performance */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>End-to-End System Performance</CardTitle>
              <CardDescription>
                Integration of ML prediction + Search algorithm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold">ML Prediction Layer</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Average Prediction Time</span>
                      <span className="font-medium">~15ms</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Batch Processing (100 sites)</span>
                      <span className="font-medium">~250ms</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Model Load Time</span>
                      <span className="font-medium">~500ms</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Search Algorithm Layer</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>A* Search Time (avg)</span>
                      <span className="font-medium">~8ms</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Beam Search Time (avg)</span>
                      <span className="font-medium">~4ms</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted rounded">
                      <span>Route Calculation (top-5)</span>
                      <span className="font-medium">~35ms</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">System Architecture</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">1</Badge>
                    <p><strong>Data Processing:</strong> Extract traffic flow from Boroondara dataset (15-min intervals)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">2</Badge>
                    <p><strong>ML Prediction:</strong> LSTM/GRU/BLSTM predicts future traffic flow per SCATS site</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">3</Badge>
                    <p><strong>Flow-to-Speed:</strong> Convert predicted flow to speed using quadratic formula</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">4</Badge>
                    <p><strong>Travel Time:</strong> Calculate edge cost = distance/speed + 30s intersection delay</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">5</Badge>
                    <p><strong>Path Search:</strong> A*/Beam/etc. finds top-k optimal routes from O to D</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Research Insights</h4>
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Best ML Model</h5>
                    <p className="text-muted-foreground">
                      <strong>BLSTM</strong> achieved highest R² (0.89) but requires 245s training time.
                      For real-time systems, <strong>LSTM</strong> offers good balance (R² = 0.87, 182s).
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Best Search Algorithm</h5>
                    <p className="text-muted-foreground">
                      <strong>A*</strong> guarantees optimal routes with 66.67% exploration.
                      <strong>Beam Search (k=2)</strong> is 2x faster with only 33.33% exploration.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}