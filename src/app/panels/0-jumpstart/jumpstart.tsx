import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { initialState, State } from "@/types";

export type JumpstartProps = {
  stateCreated: (state: State) => void;
};

const JumpstartPanel = (props: JumpstartProps) => {
  const newProject = () => {
    // Copy initialState to prevent reference
    props.stateCreated({ ...initialState });
  };

  const loadProject = () => {};

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          TopoArt
        </CardTitle>
        <CardDescription>Create artistic topographical maps</CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="flex justify-evenly">
          <Button variant="outline" size="sm" onClick={() => newProject()}>
            New Project
          </Button>
          <Button variant="outline" size="sm" onClick={() => loadProject}>
            Load Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JumpstartPanel;
