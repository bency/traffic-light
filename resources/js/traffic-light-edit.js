document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const county = urlParams.get("county");
    const district = urlParams.get("district");
    const road = urlParams.get("road");

    const redSecondsInput = document.getElementById("red-seconds");
    const saveButton = document.getElementById("save-button");

    async function fetchTrafficLightSetting() {
        const response = await fetch(
            `/api/traffic-light-settings?county=${county}&district=${district}&road=${road}`
        );
        const settings = await response.json();

        if (settings.length > 0) {
            const setting = settings[0];
            redSecondsInput.value = setting.red_seconds;
            // Set other fields
        } else {
            // Handle case where no setting is found
        }
    }

    saveButton.addEventListener("click", async function () {
        const redSeconds = redSecondsInput.value;
        // Get other field values

        const data = {
            county: county,
            district: district,
            road: road,
            red_seconds: redSeconds,
            // Other field values
        };

        const response = await fetch(`/api/traffic-light-settings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert("Traffic light setting saved successfully");
        } else {
            alert("Failed to save traffic light setting");
        }
    });

    fetchTrafficLightSetting();
});
