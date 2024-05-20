document.addEventListener("DOMContentLoaded", function () {
    const countyInput = document.getElementById("county");
    const districtInput = document.getElementById("district");
    const roadInput = document.getElementById("road");
    const settingsTableBody = document.getElementById("settings-table-body");
    const defaultCounty = "台南市";

    countyInput.addEventListener("change", fetchAndDisplayDistricts);
    countyInput.addEventListener("change", fetchAndDisplaySettings);
    districtInput.addEventListener("change", fetchAndDisplaySettings);
    roadInput.addEventListener("input", fetchAndDisplaySettings);

    async function fetchAndDisplayCounties() {
        const response = await fetch("/api/counties");
        const counties = await response.json();

        counties.forEach((county) => {
            const option = document.createElement("option");
            option.value = county;
            option.textContent = county;
            countyInput.appendChild(option);
        });

        // 預設選擇台南市
        countyInput.value = defaultCounty;
        fetchAndDisplayDistricts();
        fetchAndDisplaySettings();
    }

    async function fetchAndDisplayDistricts() {
        const county = countyInput.value;
        districtInput.innerHTML = '<option value="">Select District</option>';

        if (county) {
            const response = await fetch(`/api/districts?county=${county}`);
            const districts = await response.json();

            districts.forEach((district) => {
                const option = document.createElement("option");
                option.value = district;
                option.textContent = district;
                districtInput.appendChild(option);
            });

            districtInput.disabled = false;
        } else {
            districtInput.disabled = true;
        }
    }

    async function fetchAndDisplaySettings() {
        const county = countyInput.value;
        const district = districtInput.value;
        const road = roadInput.value;

        let url = "/api/traffic-light-settings?";
        if (county) url += `county=${county}&`;
        if (district) url += `district=${district}&`;
        if (road) url += `road=${road}`;

        // 去掉 URL 末尾的 '&' 或 '?'
        url = url.endsWith("&")
            ? url.slice(0, -1)
            : url.endsWith("?")
            ? url.slice(0, -1)
            : url;

        const response = await fetch(url);
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

    fetchAndDisplayCounties(); // Initial fetch
});
