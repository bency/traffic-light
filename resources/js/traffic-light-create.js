class TrafficLightManager {
    constructor() {
        this.trafficLightSettings = {};
        this.currentSettingId = null;
        this.remainingSeconds = 0;
        this.lastUpdateTime = Date.now();
        this.offset = 0;
        this.lightSequence = [
            "red",
            "green",
            "left-green",
            "straight-green",
            "right-green",
            "yellow",
        ];
        this.currentLight = null;
        this.showLeftGreenWithRed = true;
        this.showRightGreenWithRed = true;
        this.defaultCounty = "台南市";
        this.defaultDistrict = "";
    }

    async fetchSettings() {
        const settings = {};
        const data = [
            {
                id: 0,
                name: "",
                red_seconds: 45,
                yellow_seconds: 3,
                green_seconds: 32,
                left_green_seconds: 0,
                straight_green_seconds: 0,
                right_green_seconds: 0,
                offset: 0,
                traffic_light_location: {
                    county: "台南市",
                    district: "東區",
                },
                heading: "E",
            },
        ];
        document.getElementById("new-cycle-name").value = data[0].name;
        data.forEach((setting) => {
            settings[setting.id] = setting;
        });
        this.trafficLightSettings = settings;
        return settings;
    }

    async updateSetting(id, data) {
        if (data.start_time === null) delete data.start_time;
        if (data.end_time === null) delete data.end_time;
        await fetch(`/api/traffic-light-settings/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    }

    saveCurrentSettingId(id) {
        localStorage.setItem("currentSettingId", id);
        const url = new URL(window.location);
        url.searchParams.set("id", id);
        window.history.pushState({}, "", url);
    }

    getCurrentSettingIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("id");
    }

    determineCurrentSetting(settings) {
        const now = new Date();
        for (let id in settings) {
            const setting = settings[id];
            if (setting.start_time && setting.end_time) {
                const startTime = this.parseTime(setting.start_time);
                const endTime = this.parseTime(setting.end_time);
                if (now >= startTime && now <= endTime) {
                    return id;
                }
            }
        }
        return null;
    }

    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    async saveTimeChanges() {
        const startTime = document.getElementById("start-time").value || null;
        const endTime = document.getElementById("end-time").value || null;

        if (
            (startTime === null && endTime !== null) ||
            (startTime !== null && endTime === null)
        ) {
            alert("請同時設定起始和結束時間，或者都不填");
            return;
        }

        this.trafficLightSettings[this.currentSettingId].start_time = startTime
            ? startTime.slice(0, 5)
            : null;
        this.trafficLightSettings[this.currentSettingId].end_time = endTime
            ? endTime.slice(0, 5)
            : null;
    }

    async saveHeadingChanges() {
        const heading = document.getElementById("heading").value || null;
        this.trafficLightSettings[this.currentSettingId].heading = heading;
    }

    setInputTimes() {
        const setting = this.trafficLightSettings[this.currentSettingId];
        document.getElementById("start-time").value = setting.start_time
            ? setting.start_time.slice(0, 5)
            : "";
        document.getElementById("end-time").value = setting.end_time
            ? setting.end_time.slice(0, 5)
            : "";
    }

    setHeading() {
        const setting = this.trafficLightSettings[this.currentSettingId];
        document.getElementById("heading").value = setting.heading || "";
    }

    setCountyAndDistrict() {
        const setting = this.trafficLightSettings[this.currentSettingId];
        this.defaultCounty = setting.traffic_light_location.county;
        this.defaultDistrict = setting.traffic_light_location.district;
    }

    calculateRemainingSeconds() {
        const now = new Date();
        const targetTime = new Date(now);
        targetTime.setHours(7, 0, 0, 0);

        if (now < targetTime) {
            targetTime.setDate(targetTime.getDate() - 1);
        }

        const elapsedTime = Math.floor((now - targetTime) / 1000) + this.offset;
        const cycleDuration = this.lightSequence.reduce(
            (sum, light) =>
                sum +
                this.trafficLightSettings[this.currentSettingId][
                    `${light.replace("-", "_")}_seconds`
                ],
            0
        );

        let timeInCurrentCycle = elapsedTime % cycleDuration;
        for (const light of this.lightSequence) {
            const lightDuration =
                this.trafficLightSettings[this.currentSettingId][
                    `${light.replace("-", "_")}_seconds`
                ];
            if (timeInCurrentCycle < lightDuration) {
                this.currentLight = light;
                this.remainingSeconds = lightDuration - timeInCurrentCycle;
                break;
            }
            timeInCurrentCycle -= lightDuration;
        }
    }

    updateTrafficLight() {
        document.querySelectorAll(".light").forEach((light) => {
            light.classList.remove("active");
            light.style.display = "none";
        });

        this.lightSequence.forEach((light) => {
            const lightElement = document.getElementById(`${light}-light`);
            const lightSeconds =
                this.trafficLightSettings[this.currentSettingId][
                    `${light.replace("-", "_")}_seconds`
                ];

            if (lightSeconds > 0) {
                lightElement.style.display = "inline-block";
            }
        });

        document
            .getElementById(`${this.currentLight}-light`)
            .classList.add("active");
    }

    updateCountdown() {
        document.getElementById(
            "countdown"
        ).innerText = `剩餘秒數: ${this.remainingSeconds}`;
    }

    updateOffsetDisplay() {
        document.getElementById("offset-display").innerText = `${this.offset}`;
        document.getElementById("current-offset").innerText = this.offset;
    }

    updateCurrentSettings() {
        const setting = this.trafficLightSettings[this.currentSettingId];
        document.getElementById("current-setting-name").innerText =
            setting.name;
        document.getElementById("current-red").innerText = setting.red_seconds;
        document.getElementById("current-yellow").innerText =
            setting.yellow_seconds;
        document.getElementById("current-green").innerText =
            setting.green_seconds;
        document.getElementById("current-left-green").innerText =
            setting.left_green_seconds;
        document.getElementById("current-straight-green").innerText =
            setting.straight_green_seconds;
        document.getElementById("current-right-green").innerText =
            setting.right_green_seconds;
        document.getElementById("current-total").innerText =
            this.lightSequence.reduce(
                (sum, light) =>
                    sum + setting[`${light.replace("-", "_")}_seconds`],
                0
            );
        document.getElementById("current-offset").innerText = setting.offset;
        document.getElementById("red-time").innerText = setting.red_seconds;
        document.getElementById("yellow-time").innerText =
            setting.yellow_seconds;
        document.getElementById("green-time").innerText = setting.green_seconds;
        document.getElementById("left-green-time").innerText =
            setting.left_green_seconds;
        document.getElementById("straight-green-time").innerText =
            setting.straight_green_seconds;
        document.getElementById("right-green-time").innerText =
            setting.right_green_seconds;
    }

    async adjustOffset(amount) {
        this.offset += amount;
        this.trafficLightSettings[this.currentSettingId].offset = this.offset;
        this.calculateRemainingSeconds();
        this.updateCountdown();
        this.updateOffsetDisplay();
    }

    async changeTrafficLightSettings(id) {
        if (this.trafficLightSettings[id]) {
            this.currentSettingId = id;
            this.saveCurrentSettingId(id);

            const setting = this.trafficLightSettings[this.currentSettingId];
            document.getElementById("start-time").value = setting.start_time
                ? setting.start_time.slice(0, 5)
                : "";
            document.getElementById("end-time").value = setting.end_time
                ? setting.end_time.slice(0, 5)
                : "";

            this.offset =
                this.trafficLightSettings[this.currentSettingId].offset;
            this.calculateRemainingSeconds();
            this.lastUpdateTime = Date.now();
            this.updateTrafficLight();
            this.updateCountdown();
            this.updateOffsetDisplay();
            this.updateCurrentSettings();
            this.setHeading();
            this.setCountyAndDistrict();
            await this.fetchAndDisplayCounties();
        } else {
            console.error(`Setting ID ${id} is invalid.`);
        }
    }

    async adjustTime(light, amount) {
        const timeSpan = document.getElementById(`${light}-time`);
        let currentTime = parseInt(timeSpan.innerText);
        currentTime += amount;
        if (currentTime < 0) currentTime = 0;
        timeSpan.innerText = currentTime;
        this.trafficLightSettings[this.currentSettingId][
            `${light.replace("-", "_")}_seconds`
        ] = currentTime;
        this.calculateRemainingSeconds();
        this.updateCurrentSettings();
    }

    async addDefaultCycle() {
        const defaultCycle = {
            name: "預設週期",
            red_seconds: 30,
            yellow_seconds: 3,
            green_seconds: 30,
            left_green_seconds: 0,
            straight_green_seconds: 0,
            right_green_seconds: 0,
            offset: 0,
        };

        const response = await fetch("/api/traffic-light-settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(defaultCycle),
        });

        const newCycle = await response.json();
        const newId = newCycle.id;

        this.trafficLightSettings[newId] = newCycle;
        this.currentSettingId = newId;
        return newId;
    }

    async fetchAndDisplayCounties() {
        const countyInput = document.getElementById("county");
        const response = await fetch("/api/counties");
        const counties = await response.json();

        countyInput.innerHTML = "";

        counties.forEach((county) => {
            const option = document.createElement("option");
            option.value = county;
            option.textContent = county;
            countyInput.appendChild(option);
        });

        // 設置選中的縣市
        countyInput.value = this.defaultCounty;
        await this.fetchAndDisplayDistricts();
    }

    async fetchAndDisplayDistricts() {
        const countyInput = document.getElementById("county");
        const districtInput = document.getElementById("district");
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
            districtInput.value = this.defaultDistrict; // 設置選中的區域
        } else {
            districtInput.disabled = true;
        }
    }

    attachEventListeners() {
        document
            .getElementById("start-time")
            .addEventListener("change", () => this.saveTimeChanges());
        document
            .getElementById("end-time")
            .addEventListener("change", () => this.saveTimeChanges());
        document
            .getElementById("heading")
            .addEventListener("change", () => this.saveHeadingChanges());
        document
            .getElementById("increase-offset")
            .addEventListener("click", () => this.adjustOffset(1));
        document
            .getElementById("decrease-offset")
            .addEventListener("click", () => this.adjustOffset(-1));
        document
            .getElementById("increase-offset-5")
            .addEventListener("click", () => this.adjustOffset(5));
        document
            .getElementById("decrease-offset-5")
            .addEventListener("click", () => this.adjustOffset(-5));

        document.querySelectorAll(".increase-time").forEach((button) => {
            button.addEventListener("click", () => {
                const light = button.parentElement.parentElement.id.replace(
                    "adjust-",
                    ""
                );
                this.adjustTime(light, 1);
            });
        });
        document.querySelectorAll(".decrease-time").forEach((button) => {
            button.addEventListener("click", () => {
                const light = button.parentElement.parentElement.id.replace(
                    "adjust-",
                    ""
                );
                this.adjustTime(light, -1);
            });
        });
        document.querySelectorAll(".increase-time-5").forEach((button) => {
            button.addEventListener("click", () => {
                const light = button.parentElement.parentElement.id.replace(
                    "adjust-",
                    ""
                );
                this.adjustTime(light, 5);
            });
        });
        document.querySelectorAll(".decrease-time-5").forEach((button) => {
            button.addEventListener("click", () => {
                const light = button.parentElement.parentElement.id.replace(
                    "adjust-",
                    ""
                );
                this.adjustTime(light, -5);
            });
        });

        const setting = this.trafficLightSettings[this.currentSettingId];
        document
            .getElementById("add-cycle")
            .addEventListener("click", async () => {
                const name = document
                    .getElementById("new-cycle-name")
                    .value.trim();
                document.getElementById("start-time").value = setting.start_time
                    ? setting.start_time.slice(0, 5)
                    : "";
                document.getElementById("end-time").value = setting.end_time
                    ? setting.end_time.slice(0, 5)
                    : "";
                if (name === "") {
                    alert("請輸入週期名稱");
                    return;
                }
                setting.name = name;

                if (
                    (setting.startTime === "" && setting.endTime !== "") ||
                    (setting.startTime !== "" && setting.endTime === "")
                ) {
                    alert("請同時設定起始和結束時間，或者都不填");
                    return;
                }

                const response = await fetch("/api/traffic-light-settings", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(setting),
                });

                const createdCycle = await response.json();
                const newId = createdCycle.id;

                this.trafficLightSettings[newId] = createdCycle;
                document.getElementById("new-cycle-name").value = "";
                document.getElementById("start-time").value = "";
                document.getElementById("end-time").value = "";
            });

        const draggables = document.querySelectorAll(".draggable");
        const container = document.getElementById("time-adjust");

        draggables.forEach((draggable) => {
            draggable.addEventListener("dragstart", () => {
                draggable.classList.add("dragging");
            });

            draggable.addEventListener("dragend", async () => {
                draggable.classList.remove("dragging");
                this.lightSequence = Array.from(container.children).map(
                    (child) => child.id.replace("adjust-", "")
                );
            });
        });

        container.addEventListener("dragover", (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(container, e.clientY);
            const draggable = document.querySelector(".dragging");
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        });

        document
            .getElementById("county")
            .addEventListener("change", () => this.fetchAndDisplayDistricts());
    }

    getDragAfterElement(container, y) {
        const draggableElements = [
            ...container.querySelectorAll(".draggable:not(.dragging)"),
        ];

        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element;
    }

    countdown() {
        const now = Date.now();
        const elapsed = Math.floor((now - this.lastUpdateTime) / 1000);

        if (elapsed >= 1) {
            this.remainingSeconds -= elapsed;
            this.lastUpdateTime = now;

            if (this.remainingSeconds <= 0) {
                const setting =
                    this.trafficLightSettings[this.currentSettingId];
                let nextIndex =
                    this.lightSequence.indexOf(this.currentLight) + 1;
                while (
                    nextIndex !== this.lightSequence.indexOf(this.currentLight)
                ) {
                    if (nextIndex >= this.lightSequence.length) {
                        nextIndex = 0;
                    }
                    const nextLight = this.lightSequence[nextIndex];
                    if (setting[`${nextLight.replace("-", "_")}_seconds`] > 0) {
                        this.currentLight = nextLight;
                        this.remainingSeconds =
                            setting[
                                `${this.currentLight.replace("-", "_")}_seconds`
                            ];
                        break;
                    }
                    nextIndex++;
                }
                this.updateTrafficLight();
            }

            this.updateCountdown();
        }

        requestAnimationFrame(() => this.countdown());
    }

    async initialize() {
        await this.fetchSettings();
        this.currentSettingId =
            this.getCurrentSettingIdFromUrl() ||
            localStorage.getItem("currentSettingId");

        if (
            !this.currentSettingId ||
            !this.trafficLightSettings[this.currentSettingId]
        ) {
            if (Object.keys(this.trafficLightSettings).length > 0) {
                this.currentSettingId =
                    this.determineCurrentSetting(this.trafficLightSettings) ||
                    Object.keys(this.trafficLightSettings)[0];
                this.saveCurrentSettingId(this.currentSettingId);
            } else {
                this.currentSettingId = await this.addDefaultCycle();
                await this.fetchSettings();
            }
        }

        this.setInputTimes();
        this.setHeading();
        this.setCountyAndDistrict();
        await this.fetchAndDisplayCounties();
        this.calculateRemainingSeconds();
        this.updateTrafficLight();
        this.updateCountdown();
        this.updateOffsetDisplay();
        this.updateCurrentSettings();
        requestAnimationFrame(() => this.countdown());
        this.attachEventListeners();
    }
}

const trafficLightManager = new TrafficLightManager();
trafficLightManager.initialize();
