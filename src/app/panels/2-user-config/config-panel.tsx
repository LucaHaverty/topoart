// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Slider } from '@/components/ui/slider';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { UserConfigData, initialConfig } from '@/types';

// interface ConfigPanelProps {
//   onConfigChange: (config: UserConfigData) => void;
//   initialData: (config: )
// }

// const ConfigPanel = ({ onConfigChange }: ConfigPanelProps) => {
//   const [config, setConfig] = useState(initialConfig);

//   const updateConfig = (key, value) => {
//     const newConfig = { ...config, [key]: value };
//     setConfig(newConfig);
//     if (onConfigChange) {
//       onConfigChange(newConfig);
//     }
//   };

//   const handleAltitudeRangeChange = (values) => {
//     const newConfig = { 
//       ...config, 
//       minAltitude: values[0], 
//       maxAltitude: values[1] 
//     };
//     setConfig(newConfig);
//     if (onConfigChange) {
//       onConfigChange(newConfig);
//     }
//   };

//   const resetToDefaults = () => {
//     const defaultConfig = {
//       minAltitude: 0,
//       maxAltitude: 3000,
//       contourLines: 20,
//       gradientStartColor: '#1e3a8a',
//       gradientEndColor: '#fbbf24',
//       mapWidth: 800,
//       mapHeight: 600,
//       smoothness: 0.5,
//       noiseScale: 0.01,
//       showLabels: true,
//       lineThickness: 1,
//       majorContourInterval: 5,
//       projection: 'mercator'
//     };
//     setConfig(defaultConfig);
//     if (onConfigChange) {
//       onConfigChange(defaultConfig);
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center justify-between">
//           Topographical Map Settings
//           <Button variant="outline" size="sm" onClick={resetToDefaults}>
//             Reset
//           </Button>
//         </CardTitle>
//         <CardDescription>
//           Configure your topographical map generation parameters
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-6">
        
//         {/* Altitude Range */}
//         <div className="space-y-3">
//           <Label className="text-sm font-medium">
//             Altitude Range: {config.minAltitude}m - {config.maxAltitude}m
//           </Label>
//           <Slider
//             value={[config.minAltitude, config.maxAltitude]}
//             onValueChange={handleAltitudeRangeChange}
//             min={-500}
//             max={8000}
//             step={50}
//             className="w-full"
//           />
//         </div>

//         {/* Number of Contour Lines */}
//         <div className="space-y-3">
//           <Label className="text-sm font-medium">
//             Contour Lines: {config.contourLines}
//           </Label>
//           <Slider
//             value={[config.contourLines]}
//             onValueChange={(value) => updateConfig('contourLines', value[0])}
//             min={5}
//             max={100}
//             step={1}
//             className="w-full"
//           />
//         </div>

//         {/* Color Gradient */}
//         <div className="space-y-3">
//           <Label className="text-sm font-medium">Color Gradient</Label>
//           <div className="flex gap-3">
//             <div className="flex-1">
//               <Label className="text-xs text-gray-600">Low Altitude</Label>
//               <div className="flex items-center gap-2 mt-1">
//                 <Input
//                   type="color"
//                   value={config.gradientStartColor}
//                   onChange={(e) => updateConfig('gradientStartColor', e.target.value)}
//                   className="w-12 h-8 p-1 border rounded"
//                 />
//                 <Input
//                   type="text"
//                   value={config.gradientStartColor}
//                   onChange={(e) => updateConfig('gradientStartColor', e.target.value)}
//                   className="flex-1 text-xs"
//                 />
//               </div>
//             </div>
//             <div className="flex-1">
//               <Label className="text-xs text-gray-600">High Altitude</Label>
//               <div className="flex items-center gap-2 mt-1">
//                 <Input
//                   type="color"
//                   value={config.gradientEndColor}
//                   onChange={(e) => updateConfig('gradientEndColor', e.target.value)}
//                   className="w-12 h-8 p-1 border rounded"
//                 />
//                 <Input
//                   type="text"
//                   value={config.gradientEndColor}
//                   onChange={(e) => updateConfig('gradientEndColor', e.target.value)}
//                   className="flex-1 text-xs"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Map Dimensions */}
//         <div className="space-y-3">
//           <Label className="text-sm font-medium">Map Dimensions</Label>
//           <div className="flex gap-3">
//             <div className="flex-1">
//               <Label className="text-xs text-gray-600">Width</Label>
//               <Input
//                 type="number"
//                 value={config.mapWidth}
//                 onChange={(e) => updateConfig('mapWidth', parseInt(e.target.value))}
//                 min="200"
//                 max="2000"
//                 className="mt-1"
//               />
//             </div>
//             <div className="flex-1">
//               <Label className="text-xs text-gray-600">Height</Label>
//               <Input
//                 type="number"
//                 value={config.mapHeight}
//                 onChange={(e) => updateConfig('mapHeight', parseInt(e.target.value))}
//                 min="200"
//                 max="2000"
//                 className="mt-1"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Terrain Generation */}
//         <div className="space-y-3">
//           <Label className="text-sm font-medium">
//             Terrain Smoothness: {config.smoothness.toFixed(2)}
//           </Label>
//           <Slider
//             value={[config.smoothness]}
//             onValueChange={(value) => updateConfig('smoothness', value[0])}
//             min={0.1}
//             max={1.0}
//             step={0.05}
//             className="w-full"
//           />
//         </div>

//         <div className="space-y-3">
//           <Label className="text-sm font-medium">
//             Noise Scale: {config.noiseScale.toFixed(3)}
//           </Label>
//           <Slider
//             value={[config.noiseScale]}
//             onValueChange={(value) => updateConfig('noiseScale', value[0])}
//             min={0.001}
//             max={0.1}
//             step={0.001}
//             className="w-full"
//           />
//         </div>

//         {/* Line Styling */}
//         <div className="space-y-3">
//           <Label className="text-sm font-medium">
//             Line Thickness: {config.lineThickness}px
//           </Label>
//           <Slider
//             value={[config.lineThickness]}
//             onValueChange={(value) => updateConfig('lineThickness', value[0])}
//             min={0.5}
//             max={5}
//             step={0.25}
//             className="w-full"
//           />
//         </div>

//         <div className="space-y-3">
//           <Label className="text-sm font-medium">
//             Major Contour Every: {config.majorContourInterval} lines
//           </Label>
//           <Slider
//             value={[config.majorContourInterval]}
//             onValueChange={(value) => updateConfig('majorContourInterval', value[0])}
//             min={1}
//             max={20}
//             step={1}
//             className="w-full"
//           />
//         </div>

//         {/* Projection Type */}
//         <div className="space-y-3">
//           <Label className="text-sm font-medium">Map Projection</Label>
//           <Select 
//             value={config.projection} 
//             onValueChange={(value) => updateConfig('projection', value)}
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="mercator">Mercator</SelectItem>
//               <SelectItem value="equalArea">Equal Area</SelectItem>
//               <SelectItem value="stereographic">Stereographic</SelectItem>
//               <SelectItem value="orthographic">Orthographic</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Show Labels Toggle */}
//         <div className="flex items-center justify-between">
//           <Label className="text-sm font-medium">Show Altitude Labels</Label>
//           <Switch
//             checked={config.showLabels}
//             onCheckedChange={(checked) => updateConfig('showLabels', checked)}
//           />
//         </div>

//         {/* Current Config Preview */}
//         <div className="pt-4 border-t">
//           <Label className="text-xs text-gray-600 mb-2 block">Current Configuration</Label>
//           <div className="text-xs bg-gray-50 p-2 rounded font-mono max-h-32 overflow-y-auto">
//             {JSON.stringify(config, null, 2)}
//           </div>
//         </div>

//       </CardContent>
//     </Card>
//   );
// };

// export default TopoConfigPanel;