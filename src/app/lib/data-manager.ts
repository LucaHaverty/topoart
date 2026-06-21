import { Coordinate, DataResolution, Grid } from "@/types";

interface ElevationResult {
  elevation: number | null;
  // Add other fields if returned by the API (e.g., location: { lat: number, lng: number })
}

interface ElevationApiResponse {
  results?: ElevationResult[];
  status?: string; // Optional: depending on your API structure
}

export async function fetchElevationFromAPI(
  a: Coordinate,
  b: Coordinate,
  dataResolution: DataResolution,
): Promise<Grid | undefined> {
  const targetCols =
    dataResolution == DataResolution.Low
      ? 30
      : dataResolution == DataResolution.Medium
        ? 60
        : 100;
  const minLat = Math.min(a.lat, b.lat);
  const maxLat = Math.max(a.lat, b.lat);
  const minLon = Math.min(a.lng, b.lng);
  const maxLon = Math.max(a.lng, b.lng);

  const lonRange = maxLon - minLon;
  const latRange = maxLat - minLat;

  // Derive step from desired column count
  const step = lonRange / (targetCols - 1);
  const cols = targetCols;
  const rows = Math.round(latRange / step) + 1;

  const locations: string[] = [];
  for (let i = 0; i < rows; i++) {
    const lat = minLat + i * step;
    for (let j = 0; j < cols; j++) {
      const lon = minLon + j * step;
      locations.push(`${lat.toFixed(5)},${lon.toFixed(5)}`);
    }
  }

  // Fetch elevations in chunks (max 100 locations per request)
  const chunkSize = 100;
  const elevations: number[] = [];

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  for (let i = 0; i < locations.length; i += chunkSize) {
    const chunk: string = locations.slice(i, i + chunkSize).join("|");
    const url = `/api/elevation?locations=${encodeURIComponent(chunk)}`; // Good practice to encode query params

    const res: Response = await fetch(url);

    // Cast the JSON response to your specific interface
    const data: ElevationApiResponse = await res.json();

    if (data.results) {
      data.results.forEach((r: ElevationResult) => {
        elevations.push(r.elevation ?? 0);
      });
    }

    await delay(1000);
  }

  // Rebuild 2D grid using exact rows/cols
  const grid: Grid = [];
  let index = 0;
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(elevations[index++] ?? 0);
    }
    grid.push(row);
  }

  return grid;
}

export async function loadElevationJson(): Promise<Grid | undefined> {
  return new Promise((resolve, reject) => {
    // 1. Create a hidden file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json"; // Restrict selection to JSON files

    // 2. Listen for the file selection event
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) {
        reject(new Error("No file selected"));
        return;
      }

      // 3. Use FileReader to read the file content
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          // 4. Parse the string into an object and resolve the promise
          const jsonObject = JSON.parse(text) as Grid;
          resolve(jsonObject);
        } catch {
          reject(new Error("Invalid JSON file structure"));
        }
      };

      reader.onerror = () => reject(new Error("Error reading file"));

      // Start reading the file as plain text
      reader.readAsText(file);
    };

    // 5. Trigger the file picker dialog
    input.click();
  });
}

export async function downloadGridJson(
  grid: Grid,
  fileName: string = "elevation.json",
) {
  try {
    // Convert grid to JSON
    const jsonString = JSON.stringify(grid);

    // Create a Blob from the JSON string with the correct MIME type
    const blob = new Blob([jsonString], { type: "application/json" });

    // 2. Create a temporary URL pointing to the Blob
    const url = URL.createObjectURL(blob);

    // 3. Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.endsWith(".json") ? fileName : `${fileName}.json`;

    // 4. Append to the DOM, trigger the click, and clean up
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download JSON file:", error);
  }
}
