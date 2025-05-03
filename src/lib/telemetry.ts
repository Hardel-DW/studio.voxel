const TelemetryEvent = ["converted_datapack", "migrated_datapack", "marketplace_download"] as const;
type TelemetryEventType = (typeof TelemetryEvent)[number];

export async function trackEvent(event: TelemetryEventType) {
    try {
        const response = await fetch("https://dashboard.hardel.io/api/telemetry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ event })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to track event:", event, error);
        return null;
    }
}

export async function saveLogs(data: any) {
    try {
        const response = await fetch("https://dashboard.hardel.io/api/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Failed to save migration log: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error saving migration log:", error);
    }
}
