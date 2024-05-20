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
    }

    async fetchSettings() {
        const response = await fetch("/api/traffic-light-settings");
        const data = await response.json();
        const settings = {};
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

    attachTimeChangeListeners() {
        document
            .getElementById("start-time")
            .addEventListener("change", () => this.saveTimeChanges());
        document
            .getElementById("end-time")
            .addEventListener("change", () => this.saveTimeChanges());
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

        this.trafficLightSettings[this.currentSettingId].start_time = startTime;
        this.trafficLightSettings[this.currentSettingId].end_time = endTime;

        await this.updateSetting(
            this.currentSettingId,
            this.trafficLightSettings[this.currentSettingId]
        );
    }

    setInputTimes() {
        const setting = this.trafficLightSettings[this.currentSettingId];
        document.getElementById("start-time").value = setting.start_time || "";
        document.getElementById("end-time").value = setting.end_time || "";
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
            light.style.opacity = 0.3;
            light.style.display = "none";
        });

        document.getElementById(`${this.currentLight}-light`).style.opacity = 1;
        document.getElementById(`${this.currentLight}-light`).style.display =
            "inline-block";

        if (this.currentLight === "red") {
            if (
                this.showLeftGreenWithRed &&
                this.trafficLightSettings[this.currentSettingId]
                    .left_green_seconds > 0
            ) {
                document.getElementById("left-green-light").style.display =
                    "inline-block";
                document.getElementById("left-green-light").style.opacity = 1;
            }
            if (
                this.showRightGreenWithRed &&
                this.trafficLightSettings[this.currentSettingId]
                    .right_green_seconds > 0
            ) {
                document.getElementById("right-green-light").style.display =
                    "inline-block";
                document.getElementById("right-green-light").style.opacity = 1;
            }
        }
    }

    updateCountdown() {
        document.getElementById(
            "countdown"
        ).innerText = `剩餘秒數: ${this.remainingSeconds}`;
    }

    updateOffsetDisplay() {
        document.getElementById(
            "offset-display"
        ).innerText = `偏移量: ${this.offset} 秒`;
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
        this.updateSettingsOptions();
    }

    updateSettingsOptions() {
        const settingsOptions = document.getElementById("settings-options");
        settingsOptions.innerHTML = "";

        Object.keys(this.trafficLightSettings).forEach((id) => {
            const setting = this.trafficLightSettings[id];
            const option = document.createElement("div");
            option.className = "setting-option";
            option.dataset.id = id;

            let displayText = `${setting.name}`;
            if (setting.start_time) {
                displayText += ` (${setting.start_time})`;
            } else {
                displayText += ` (墊檔)`;
            }

            option.innerText = displayText;

            if (parseInt(id) === parseInt(this.currentSettingId)) {
                option.classList.add("active");
            }

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.innerText = "刪除";
            deleteButton.addEventListener("click", (e) => {
                e.stopPropagation();
                this.deleteTrafficLightSetting(id);
            });

            option.appendChild(deleteButton);
            option.addEventListener("click", () => {
                this.changeTrafficLightSettings(parseInt(id));
            });

            settingsOptions.appendChild(option);
        });
    }

    async adjustOffset(amount) {
        this.offset += amount;
        this.trafficLightSettings[this.currentSettingId].offset = this.offset;
        await this.updateSetting(
            this.currentSettingId,
            this.trafficLightSettings[this.currentSettingId]
        );
        this.calculateRemainingSeconds();
        this.updateCountdown();
        this.updateOffsetDisplay();
    }

    async changeTrafficLightSettings(id) {
        if (this.trafficLightSettings[id]) {
            this.currentSettingId = id;
            this.saveCurrentSettingId(id);

            const setting = this.trafficLightSettings[this.currentSettingId];
            document.getElementById("start-time").value =
                setting.start_time || "";
            document.getElementById("end-time").value = setting.end_time || "";

            this.offset =
                this.trafficLightSettings[this.currentSettingId].offset;
            this.calculateRemainingSeconds();
            this.lastUpdateTime = Date.now();
            this.updateTrafficLight();
            this.updateCountdown();
            this.updateOffsetDisplay();
            this.updateCurrentSettings();
            this.updateSettingsOptions();
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
        await this.updateSetting(
            this.currentSettingId,
            this.trafficLightSettings[this.currentSettingId]
        );
        this.calculateRemainingSeconds();
        this.updateCurrentSettings();
    }

    async deleteTrafficLightSetting(id) {
        await fetch(`/api/traffic-light-settings/${id}`, {
            method: "DELETE",
        });
        delete this.trafficLightSettings[id];
        this.updateSettingsOptions();
        const remainingKeys = Object.keys(this.trafficLightSettings);
        if (remainingKeys.length > 0) {
            this.currentSettingId = remainingKeys[0];
        } else {
            this.currentSettingId = await this.addDefaultCycle();
        }
        this.calculateRemainingSeconds();
        this.updateTrafficLight();
        this.updateCountdown();
        this.updateOffsetDisplay();
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
        this.updateSettingsOptions();
        return newId;
    }

    attachEventListeners() {
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

        document
            .getElementById("add-cycle")
            .addEventListener("click", async () => {
                const name = document
                    .getElementById("new-cycle-name")
                    .value.trim();
                const startTime = document.getElementById("start-time").value;
                const endTime = document.getElementById("end-time").value;
                if (name === "") {
                    alert("請輸入週期名稱");
                    return;
                }

                if (
                    (startTime === "" && endTime !== "") ||
                    (startTime !== "" && endTime === "")
                ) {
                    alert("請同時設定起始和結束時間，或者都不填");
                    return;
                }

                const newCycle = {
                    name: name,
                    red_seconds: 30,
                    yellow_seconds: 3,
                    green_seconds: 30,
                    left_green_seconds: 0,
                    straight_green_seconds: 0,
                    right_green_seconds: 0,
                    offset: 0,
                    start_time: startTime || null,
                    end_time: endTime || null,
                };

                const response = await fetch("/api/traffic-light-settings", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newCycle),
                });

                const createdCycle = await response.json();
                const newId = createdCycle.id;

                this.trafficLightSettings[newId] = createdCycle;
                document.getElementById("new-cycle-name").value = "";
                document.getElementById("start-time").value = "";
                document.getElementById("end-time").value = "";
                this.updateSettingsOptions();
            });

        document
            .getElementById("show-left-arrow")
            .addEventListener("change", (e) => {
                this.showLeftGreenWithRed = e.target.checked;
                this.updateTrafficLight();
            });

        document
            .getElementById("show-right-arrow")
            .addEventListener("change", (e) => {
                this.showRightGreenWithRed = e.target.checked;
                this.updateTrafficLight();
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
                await this.updateSetting(
                    this.currentSettingId,
                    this.trafficLightSettings[this.currentSettingId]
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

    startIntervalCheck() {
        setInterval(() => {
            const newSettingId = this.determineCurrentSetting(
                this.trafficLightSettings
            );
            if (newSettingId !== this.currentSettingId) {
                this.changeTrafficLightSettings(newSettingId);
            }
        }, 60000);
    }

    async initialize() {
        await this.fetchSettings();
        this.currentSettingId = localStorage.getItem("currentSettingId");

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

        this.attachTimeChangeListeners();
        this.setInputTimes();
        this.calculateRemainingSeconds();
        this.updateTrafficLight();
        this.updateCountdown();
        this.updateOffsetDisplay();
        this.updateCurrentSettings();
        requestAnimationFrame(() => this.countdown());
        this.startIntervalCheck();
        this.attachEventListeners();
    }
}

const trafficLightManager = new TrafficLightManager();
trafficLightManager.initialize();
