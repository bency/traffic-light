document.addEventListener("DOMContentLoaded", function () {
    const countyInput = document.getElementById("county");
    const districtInput = document.getElementById("district");
    const roadInput = document.getElementById("road");
    const roadResults = document.getElementById("road-results");
    const createButton = document.getElementById("create-button");
    const defaultCounty = "台南市";

    countyInput.addEventListener("change", fetchAndDisplayDistricts);
    countyInput.addEventListener("change", clearRoadInput);
    districtInput.addEventListener("change", clearRoadInput);
    roadInput.addEventListener("input", fetchAndDisplayRoads);
    roadResults.addEventListener("click", selectRoad);

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

    async function fetchAndDisplayRoads() {
        const county = countyInput.value;
        const district = districtInput.value;
        const road = roadInput.value;

        if (road.length < 1) {
            roadResults.style.display = "none";
            return;
        }

        let url = `/api/roads?county=${county}&district=${district}&road=${road}`;

        const response = await fetch(url);
        const roads = await response.json();

        roadResults.innerHTML = "";
        roads.forEach((road) => {
            const option = document.createElement("option");
            option.value = road;
            option.textContent = road;
            roadResults.appendChild(option);
        });

        roadResults.style.display = roads.length ? "block" : "none";
    }

    function selectRoad(event) {
        roadInput.value = event.target.value;
        roadResults.style.display = "none";
    }

    function clearRoadInput() {
        roadInput.value = "";
        roadResults.style.display = "none";
    }

    createButton.addEventListener("click", function () {
        const county = countyInput.value;
        const district = districtInput.value;
        const road = roadInput.value;

        if (county && district && road) {
            window.location.href = `/traffic-light/edit?county=${county}&district=${district}&road=${road}`;
        } else {
            alert("Please select county, district and road.");
        }
    });

    fetchAndDisplayCounties(); // Initial fetch
});
