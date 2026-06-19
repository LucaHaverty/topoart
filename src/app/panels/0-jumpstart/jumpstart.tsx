import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State, UserConfigData, initialConfig } from "@/types";

interface JumpstartProps {
  stateCreated: (state: State) => void;
}

const JumpstartPanel = (stateCreated: JumpstartProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Topographical Map Settings
          <Button variant="outline" size="sm" onClick={() => console.log("ah")}>
            Reset
          </Button>
        </CardTitle>
        <CardDescription>
          Configure your topographical map generation parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Altitude Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Altitude Range: Am - Bm</Label>
          <Slider
            value={[10, 20]}
            onValueChange={() => {}}
            min={-500}
            max={8000}
            step={50}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JumpstartPanel;
