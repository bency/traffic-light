document.addEventListener("DOMContentLoaded", function () {
    const countyInput = document.getElementById("county");
    const districtInput = document.getElementById("district");
    const roadInput = document.getElementById("road");
    const settingsTableBody = document.getElementById("settings-table-body");

    countyInput.addEventListener("input", fetchAndDisplaySettings);
    districtInput.addEventListener("input", fetchAndDisplaySettings);
    roadInput.addEventListener("input", fetchAndDisplaySettings);

    async function fetchAndDisplaySettings() {
        const county = countyInput.value;
        const district = districtInput.value;
        const road = roadInput.value;

        const response = await fetch(
            `/api/traffic-light-settings?county=${county}&district=${district}&road=${road}`
        );
        const settings = await response.json();

        settingsTableBody.innerHTML = "";

        settings.forEach((setting) => {
            const row = document.createElement("tr");

            const countyCell = document.createElement("td");
            countyCell.textContent = setting.traffic_light_location.county;
            row.appendChild(countyCell);

            const districtCell = document.createElement("td");
            districtCell.textContent = setting.traffic_light_location.district;
            row.appendChild(districtCell);

            const roadsCell = document.createElement("td");
            roadsCell.textContent =
                setting.traffic_light_location.connected_roads;
            row.appendChild(roadsCell);

            const headingCell = document.createElement("td");
            headingCell.textContent = setting.heading;
            row.appendChild(headingCell);

            settingsTableBody.appendChild(row);
        });
    }

    fetchAndDisplaySettings(); // Initial fetch
});
