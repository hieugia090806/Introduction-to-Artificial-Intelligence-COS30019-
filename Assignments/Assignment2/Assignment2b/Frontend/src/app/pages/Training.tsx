import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Brain, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp,
  Clock,
  Database,
  Settings
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { mlModelMetrics } from "../data/mockData";

export function Training() {
  const [selectedModel, setSelectedModel] = useState<string>("LSTM");

  // Static training history for chart display only
  const trainingHistory = [
    { epoch: 10, loss: 0.45, val_loss: 0.48, mae: 15.2, val_mae: 16.8 },
    { epoch: 20, loss: 0.32, val_loss: 0.36, mae: 12.5, val_mae: 13.9 },
    { epoch: 30, loss: 0.25, val_loss: 0.29, mae: 11.1, val_mae: 12.3 },
    { epoch: 40, loss: 0.19, val_loss: 0.24, mae: 10.2, val_mae: 11.5 },
    { epoch: 50, loss: 0.15, val_loss: 0.21, mae: 9.8, val_mae: 10.9 },
    { epoch: 60, loss: 0.13, val_loss: 0.19, mae: 9.5, val_mae: 10.6 },
    { epoch: 70, loss: 0.11, val_loss: 0.18, mae: 9.3, val_mae: 10.4 },
    { epoch: 80, loss: 0.10, val_loss: 0.17, mae: 9.1, val_mae: 10.2 },
    { epoch: 90, loss: 0.09, val_loss: 0.17, mae: 9.0, val_mae: 10.1 },
    { epoch: 100, loss: 0.08, val_loss: 0.16, mae: 8.9, val_mae: 10.0 },
  ];

  const modelDescriptions = {
    LSTM: {
      title: "Long Short-Term Memory",
      description: "Handles long-term dependencies in sequential data. Best for capturing temporal patterns in traffic flow.",
      architecture: "2 LSTM layers (128, 64 units) + Dense output",
      params: "~85,000 trainable parameters",
    },
    GRU: {
      title: "Gated Recurrent Unit",
      description: "Simpler than LSTM with fewer parameters. Faster training while maintaining good performance.",
      architecture: "2 GRU layers (128, 64 units) + Dense output",
      params: "~64,000 trainable parameters",
    },
    BLSTM: {
      title: "Bidirectional Long Short-Term Memory",
      description: "An improved version of LSTM with enhanced memory management. Balances performance and computational efficiency.",
      architecture: "2 BLSTM layers (128, 64 units) + Dense output",
      params: "~90,000 trainable parameters",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Model Training</h1>
        <p className="text-muted-foreground">
          Train and evaluate ML models for traffic flow prediction
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Training Pipeline & Model Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Pipeline & Model Description</CardTitle>
              <CardDescription>
                Below is a static description of the ML pipeline and model architectures used for traffic flow prediction.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Model Selection (static, no action) */}
              <div className="space-y-2">
                <Label htmlFor="model">Select Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel} disabled>
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LSTM">LSTM - Long Short-Term Memory</SelectItem>
                    <SelectItem value="GRU">GRU - Gated Recurrent Unit</SelectItem>
                    <SelectItem value="BLSTM">BLSTM - Bidirectional LSTM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Model Description */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  {modelDescriptions[selectedModel as keyof typeof modelDescriptions].title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {modelDescriptions[selectedModel as keyof typeof modelDescriptions].description}
                </p>
                <div className="text-xs text-muted-foreground space-y-1 pt-2">
                  <p>• Architecture: {modelDescriptions[selectedModel as keyof typeof modelDescriptions].architecture}</p>
                  <p>• Parameters: {modelDescriptions[selectedModel as keyof typeof modelDescriptions].params}</p>
                </div>
              </div>

              {/* Pipeline Description (static) */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Training Pipeline
                </h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  <li>Data preprocessing & cleaning</li>
                  <li>Feature engineering</li>
                  <li>Train/validation/test split</li>
                  <li>Model selection (LSTM, GRU, BLSTM)</li>
                  <li>Model training (pre-trained, static demo)</li>
                  <li>Evaluation & comparison</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Training History (static chart) */}
          <Card>
            <CardHeader>
              <CardTitle>Training History</CardTitle>
              <CardDescription>
                Loss and MAE metrics over training epochs (static demo)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="loss">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="loss">Loss</TabsTrigger>
                  <TabsTrigger value="mae">MAE</TabsTrigger>
                </TabsList>
                <TabsContent value="loss" className="mt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trainingHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        key="training-loss"
                        type="monotone" 
                        dataKey="loss" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={2}
                        name="Training Loss"
                      />
                      <Line 
                        key="validation-loss"
                        type="monotone" 
                        dataKey="val_loss" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                        name="Validation Loss"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="mae" className="mt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trainingHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'MAE', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        key="training-mae"
                        type="monotone" 
                        dataKey="mae" 
                        stroke="hsl(var(--chart-3))" 
                        strokeWidth={2}
                        name="Training MAE"
                      />
                      <Line 
                        key="validation-mae"
                        type="monotone" 
                        dataKey="val_mae" 
                        stroke="hsl(var(--chart-4))" 
                        strokeWidth={2}
                        name="Validation MAE"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dataset Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4" />
                Dataset Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span className="font-medium">VicRoads</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">Boroondara</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period</span>
                <span className="font-medium">Oct 2006</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interval</span>
                <span className="font-medium">15 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SCATS Sites</span>
                <span className="font-medium">170+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Samples</span>
                <span className="font-medium">~162,000</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Train Set</span>
                  <Badge variant="outline">70%</Badge>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">Validation</span>
                  <Badge variant="outline">15%</Badge>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">Test Set</span>
                  <Badge variant="outline">15%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Model Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Trained Models
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(mlModelMetrics).map(([name, metrics]) => (
                <div 
                  key={name}
                  className={`p-3 rounded-lg border ${
                    name === selectedModel ? 'bg-primary/5 border-primary' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{name}</span>
                    <Badge variant={name === "BLSTM" ? "default" : "secondary"}>
                      {name === "BLSTM" ? "Best" : "Trained"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>R² Score</span>
                      <span className="font-medium">{metrics.r2.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MAE</span>
                      <span className="font-medium">{metrics.mae.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RMSE</span>
                      <span className="font-medium">{metrics.rmse.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Training Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>• Start with 100 epochs for initial training</p>
              <p>• Use batch size of 32 or 64 for better convergence</p>
              <p>• Monitor validation loss to detect overfitting</p>
              <p>• Lower learning rate if training is unstable</p>
              <p>• BLSTM requires more computational resources</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}