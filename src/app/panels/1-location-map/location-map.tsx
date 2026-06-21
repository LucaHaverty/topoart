"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coordinate, DataResolution, State } from "@/types";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { Map, LeafletMouseEvent, Marker } from "leaflet";

export type LocationMapProps = {
  state: State;
  onNext: () => void;
};

type LeafletInstance = { map: Map; L: typeof import("leaflet") };

const COLORS = ["#534AB7", "#0F6E56"] as const;

const LocationMapPanel = ({ state, onNext }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletInstance | null>(null);
  const markersRef = useRef<{ marker: Marker; map: Map }[]>([]);
  const cornersRef = useRef<Coordinate[]>([]);
  const [corners, setCorners] = useState<Coordinate[]>([]);

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    let mounted = true;

    import("leaflet").then((L) => {
      if (!mounted || !mapRef.current || mapInstanceRef.current) return;

      (
        L.Icon.Default.prototype as unknown as Record<string, unknown>
      )._getIconUrl = undefined;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current).setView([37.7749, -122.4194], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      map.on("click", (e: LeafletMouseEvent) => {
        const prev = cornersRef.current;
        if (prev.length >= 2) return; // Keep an eye on this check, currently caps at 2 instead of 4

        const next: Coordinate[] = [
          ...prev,
          { lat: e.latlng.lat, lng: e.latlng.lng },
        ];

        const icon = L.divIcon({
          html: `<div style="background:${COLORS[prev.length]};color:#fff;width:12px;height:12px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3);"></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          className: "",
        });

        // Create the marker
        const newMarker = L.marker(e.latlng, { icon });

        // Add it to the map
        newMarker.addTo(map);

        // Track that specific instance
        markersRef.current.push({ marker: newMarker, map });

        cornersRef.current = next;
        setCorners([...next]);

        if (next.length === 4) {
          const coords = next.map((c) => ({
            lat: +c.lat.toFixed(6),
            lng: +c.lng.toFixed(6),
          }));
          console.log("=== Corners ===");
          // coords.forEach((c, idx) =>
          // console.log(`${LABELS[idx]}: lat=${c.lat}, lng=${c.lng}`),
          // );
          console.log("As array:", JSON.stringify(coords));
        }

        if (state.userConfig.a == undefined) {
          state.userConfig.a = { lat: e.latlng.lat, lng: e.latlng.lng };
        } else state.userConfig.b = { lat: e.latlng.lat, lng: e.latlng.lng };
      });

      mapInstanceRef.current = { map, L };
    });

    return () => {
      mounted = false;
      mapInstanceRef.current?.map.remove();
      mapInstanceRef.current = null;
    };
  }, [state.userConfig]);

  const handleClear = () => {
    const instance = mapInstanceRef.current;
    if (!instance) return;
    markersRef.current.forEach(({ marker }) =>
      instance.map.removeLayer(marker),
    );
    markersRef.current = [];
    cornersRef.current = [];
    setCorners([]);

    state.userConfig.a = undefined;
    state.userConfig.b = undefined;
  };

  const handleNext = () => {
    state.userConfig.dataResolution = resolution;
    onNext();
  };

  const LEVELS = ["Low", "Medium", "High"];

  const [resolution, setResolution] = useState(DataResolution.Low);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Location Selection
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </CardTitle>
          <CardDescription>Click the map to place 2 corners.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div
            ref={mapRef}
            className="w-full rounded-lg border overflow-hidden"
            style={{ height: 400 }}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">
              {corners.length}/2 points
            </span>
            {corners.map((c, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded"
                style={{
                  background: `${COLORS[i]}22`,
                  color: COLORS[i],
                  border: `0.5px solid ${COLORS[i]}66`,
                  fontWeight: 500,
                }}
              >
                {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Data Resolution</Label>
              <span className="text-sm text-muted-foreground">
                {LEVELS[resolution - 1]}
              </span>
            </div>
            <Slider
              value={[resolution]}
              onValueChange={(v) => setResolution(v[0])}
              min={1}
              max={3}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={corners.length != 2}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default LocationMapPanel;
