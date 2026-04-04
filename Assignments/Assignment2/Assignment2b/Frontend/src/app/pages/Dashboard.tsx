import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, MapPin, Brain, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { mockTrafficPredictions, mlModelMetrics, searchAlgorithms } from "../data/mockData";

export function Dashboard() {
  const stats = [
    {
      title: "Active Routes",
      value: "5",
      description: "Currently tracked",
      icon: MapPin,
      trend: "+2 from yesterday",
    },
    {
      title: "ML Models",
      value: "3",
      description: "LSTM, GRU, BLSTM",
      icon: Brain,
      trend: "All models trained",
    },
    {
      title: "Avg Traffic Flow",
      value: "1,084",
      description: "Vehicles/hour",
      icon: Activity,
      trend: "+12% from last week",
    },
    {
      title: "Prediction Accuracy",
      value: "89%",
      description: "Best model (BLSTM)",
      icon: TrendingUp,
      trend: "R² score: 0.89",
    },
  ];

  const modelComparison = Object.entries(mlModelMetrics).map(([name, metrics]) => ({
    name,
    MAE: metrics.mae,
    RMSE: metrics.rmse,
    'R²': metrics.r2 * 100,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Traffic Overview (Prediction-based)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Dashboard displays aggregated predictions and system status.<br/>
          Detailed routing interaction is available in the Route Planner.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Predicted Traffic Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle>Predicted Traffic Snapshot (LSTM)</CardTitle>
            <CardDescription>
              Hourly traffic volume forecast for Boroondara area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTrafficPredictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis label={{ value: 'Vehicles/hour', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line 
                  key="traffic-flow-line"
                  type="monotone" 
                  dataKey="flow" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                  name="Traffic Flow"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Model Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>ML Model Performance</CardTitle>
            <CardDescription>
              Comparison of prediction accuracy (lower MAE/RMSE is better)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar key="bar-mae" dataKey="MAE" fill="hsl(var(--chart-1))" name="MAE" />
                <Bar key="bar-rmse" dataKey="RMSE" fill="hsl(var(--chart-2))" name="RMSE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Search Algorithms Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Search Algorithms Comparison</CardTitle>
          <CardDescription>
            Performance metrics from Assignment 2A - Tree-based Search
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={searchAlgorithms}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar key="bar-exploration" dataKey="explorationRatio" fill="hsl(var(--chart-3))" name="Exploration Ratio (%)" />
              <Bar key="bar-nodes" dataKey="nodesExpanded" fill="hsl(var(--chart-4))" name="Nodes Expanded" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>• <strong>Beam Search</strong> shows the most efficient exploration (33.33%) with controlled frontier size</p>
            <p>• <strong>A*</strong> balances optimality with reasonable exploration (66.67%)</p>
            <p>• <strong>BFS</strong> guarantees shortest path but explores the most nodes (83.33%)</p>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Current configuration and dataset details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Dataset</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Location: Boroondara, Melbourne</li>
                <li>• SCATS Sites: 170+ intersections</li>
                <li>• Period: October 2006 (VicRoads)</li>
                <li>• Interval: 15-minute traffic flow data</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Traffic Model</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Speed Limit: 60 km/h</li>
                <li>• Capacity: 1500 vehicles/hour @ 32 km/h</li>
                <li>• Intersection Delay: 30 seconds</li>
                <li>• Formula: flow = -1.46(speed)² + 93.75(speed)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}