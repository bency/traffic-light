// 从 API 获取数据并存储到 localStorage 中
async function fetchSettings() {
    const response = await fetch("/api/traffic-light-settings");
    const data = await response.json();
    return data;
}

// 更新设置到数据库
async function updateSetting(id, data) {
    await fetch(`/api/traffic-light-settings/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

// 初始化设置
async function initializeSettings() {
    let trafficLightSettings = await fetchSettings();
    let currentSettingId = Object.keys(trafficLightSettings)[0];
    let remainingSeconds = trafficLightSettings[currentSettingId].red_seconds;
    let lastUpdateTime = Date.now();
    let offset = trafficLightSettings[currentSettingId].offset; // 确保加载时读取偏移量
    let lightSequence = [
        "red",
        "green",
        "left-green",
        "straight-green",
        "right-green",
        "yellow",
    ];
    let currentLight; // 声明 currentLight

    // 是否顯示左轉綠燈和右轉綠燈的標誌
    let showLeftGreenWithRed = true;
    let showRightGreenWithRed = true;

    function calculateRemainingSeconds() {
        const now = new Date();
        const targetTime = new Date(now);
        targetTime.setHours(7, 0, 0, 0); // 設置為當天早上7點

        if (now < targetTime) {
            targetTime.setDate(targetTime.getDate() - 1); // 如果現在時間還沒到7點，則取前一天的7點
        }

        const elapsedTime = Math.floor((now - targetTime) / 1000) + offset; // 考虑偏移量
        const cycleDuration = lightSequence.reduce(
            (sum, light) =>
                sum +
                trafficLightSettings[currentSettingId][
                    `${light.replace("-", "_")}_seconds`
                ],
            0
        );

        let timeInCurrentCycle = elapsedTime % cycleDuration;
        for (const light of lightSequence) {
            const lightDuration =
                trafficLightSettings[currentSettingId][
                    `${light.replace("-", "_")}_seconds`
                ];
            if (timeInCurrentCycle < lightDuration) {
                currentLight = light;
                remainingSeconds = lightDuration - timeInCurrentCycle;
                break;
            }
            timeInCurrentCycle -= lightDuration;
        }
    }

    function updateTrafficLight() {
        document.querySelectorAll(".light").forEach((light) => {
            light.style.opacity = 0.3;
            light.style.display = "none"; // 默认隐藏
        });

        document.getElementById(`${currentLight}-light`).style.opacity = 1;
        document.getElementById(`${currentLight}-light`).style.display =
            "inline-block";

        if (currentLight === "red") {
            if (
                showLeftGreenWithRed &&
                trafficLightSettings[currentSettingId].left_green_seconds > 0
            ) {
                document.getElementById("left-green-light").style.display =
                    "inline-block";
                document.getElementById("left-green-light").style.opacity = 1;
            }
            if (
                showRightGreenWithRed &&
                trafficLightSettings[currentSettingId].right_green_seconds > 0
            ) {
                document.getElementById("right-green-light").style.display =
                    "inline-block";
                document.getElementById("right-green-light").style.opacity = 1;
            }
        }
    }

    function updateCountdown() {
        document.getElementById(
            "countdown"
        ).innerText = `剩餘秒數: ${remainingSeconds}`;
    }

    function updateOffsetDisplay() {
        document.getElementById(
            "offset-display"
        ).innerText = `偏移量: ${offset} 秒`;
        document.getElementById("current-offset").innerText = offset;
    }

    function updateCurrentSettings() {
        const setting = trafficLightSettings[currentSettingId];
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
            lightSequence.reduce(
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
        updateSettingsOptions();
    }

    function updateSettingsOptions() {
        const settingsOptions = document.getElementById("settings-options");
        settingsOptions.innerHTML = ""; // 清空现有选项

        Object.keys(trafficLightSettings).forEach((id) => {
            const setting = trafficLightSettings[id];
            const option = document.createElement("div");
            option.className = "setting-option";
            option.dataset.id = id;
            option.dataset.red = setting.red_seconds;
            option.dataset.yellow = setting.yellow_seconds;
            option.dataset.green = setting.green_seconds;
            option.dataset.leftGreen = setting.left_green_seconds;
            option.dataset.straightGreen = setting.straight_green_seconds;
            option.dataset.rightGreen = setting.right_green_seconds;
            option.innerText = `${setting.name}: 紅燈: ${setting.red_seconds}秒, 黃燈: ${setting.yellow_seconds}秒, 綠燈: ${setting.green_seconds}秒, 左轉綠燈: ${setting.left_green_seconds}秒, 直行綠燈: ${setting.straight_green_seconds}秒, 右轉綠燈: ${setting.right_green_seconds}秒`;

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.innerText = "刪除";
            deleteButton.addEventListener("click", (e) => {
                e.stopPropagation();
                deleteTrafficLightSetting(id);
            });

            option.appendChild(deleteButton);
            option.addEventListener("click", () => {
                changeTrafficLightSettings(parseInt(id));
            });

            settingsOptions.appendChild(option);
        });
    }

    async function adjustOffset(amount) {
        offset += amount;
        trafficLightSettings[currentSettingId].offset = offset; // 保存偏移量
        await updateSetting(
            currentSettingId,
            trafficLightSettings[currentSettingId]
        );
        calculateRemainingSeconds(); // 重新计算剩余时间
        updateCountdown(); // 即时更新倒数计时
        updateOffsetDisplay(); // 即时更新偏移量显示
    }

    async function changeTrafficLightSettings(id) {
        currentSettingId = id;
        offset = trafficLightSettings[currentSettingId].offset;
        calculateRemainingSeconds();
        lastUpdateTime = Date.now();
        updateTrafficLight();
        updateCountdown();
        updateOffsetDisplay();
        updateCurrentSettings();
    }

    async function adjustTime(light, amount) {
        const timeSpan = document.getElementById(`${light}-time`);
        let currentTime = parseInt(timeSpan.innerText);
        currentTime += amount;
        if (currentTime < 0) currentTime = 0;
        timeSpan.innerText = currentTime;
        trafficLightSettings[currentSettingId][
            `${light.replace("-", "_")}_seconds`
        ] = currentTime;
        await updateSetting(
            currentSettingId,
            trafficLightSettings[currentSettingId]
        );
        calculateRemainingSeconds(); // 确保时间调整后重新计算剩余时间
        updateCurrentSettings();
    }

    async function deleteTrafficLightSetting(id) {
        await fetch(`/api/traffic-light-settings/${id}`, {
            method: "DELETE",
        });
        delete trafficLightSettings[id];
        updateSettingsOptions();
        const remainingKeys = Object.keys(trafficLightSettings);
        if (remainingKeys.length > 0) {
            currentSettingId = remainingKeys[0];
        } else {
            await addDefaultCycle();
        }
        calculateRemainingSeconds();
        updateTrafficLight();
        updateCountdown();
        updateOffsetDisplay();
        updateCurrentSettings();
    }

    async function addDefaultCycle() {
        const newId = new Date().getTime(); // 用时间戳生成唯一ID
        const defaultCycle = {
            name: "默认週期",
            red_seconds: 30,
            yellow_seconds: 3,
            green_seconds: 30,
            left_green_seconds: 0,
            straight_green_seconds: 0,
            right_green_seconds: 0,
            offset: 0,
        };
        trafficLightSettings[newId] = defaultCycle;
        await updateSetting(newId, defaultCycle);
        currentSettingId = newId;
        updateSettingsOptions();
    }

    document
        .getElementById("increase-offset")
        .addEventListener("click", () => adjustOffset(1));
    document
        .getElementById("decrease-offset")
        .addEventListener("click", () => adjustOffset(-1));
    document
        .getElementById("increase-offset-5")
        .addEventListener("click", () => adjustOffset(5));
    document
        .getElementById("decrease-offset-5")
        .addEventListener("click", () => adjustOffset(-5));

    document.querySelectorAll(".increase-time").forEach((button) => {
        button.addEventListener("click", () => {
            const light = button.parentElement.parentElement.id.replace(
                "adjust-",
                ""
            );
            adjustTime(light, 1);
        });
    });
    document.querySelectorAll(".decrease-time").forEach((button) => {
        button.addEventListener("click", () => {
            const light = button.parentElement.parentElement.id.replace(
                "adjust-",
                ""
            );
            adjustTime(light, -1);
        });
    });
    document.querySelectorAll(".increase-time-5").forEach((button) => {
        button.addEventListener("click", () => {
            const light = button.parentElement.parentElement.id.replace(
                "adjust-",
                ""
            );
            adjustTime(light, 5);
        });
    });
    document.querySelectorAll(".decrease-time-5").forEach((button) => {
        button.addEventListener("click", () => {
            const light = button.parentElement.parentElement.id.replace(
                "adjust-",
                ""
            );
            adjustTime(light, -5);
        });
    });

    document.getElementById("add-cycle").addEventListener("click", async () => {
        const name = document.getElementById("new-cycle-name").value.trim();
        if (name === "") {
            alert("請輸入週期名稱");
            return;
        }
        const newId = new Date().getTime(); // 用时间戳生成唯一ID
        const newCycle = {
            name: name,
            red_seconds: 30,
            yellow_seconds: 3,
            green_seconds: 30,
            left_green_seconds: 0,
            straight_green_seconds: 0,
            right_green_seconds: 0,
            offset: 0,
        };
        trafficLightSettings[newId] = newCycle;
        await updateSetting(newId, newCycle);
        document.getElementById("new-cycle-name").value = "";
        updateSettingsOptions();
    });

    document
        .getElementById("show-left-arrow")
        .addEventListener("change", (e) => {
            showLeftGreenWithRed = e.target.checked;
            updateTrafficLight();
        });

    document
        .getElementById("show-right-arrow")
        .addEventListener("change", (e) => {
            showRightGreenWithRed = e.target.checked;
            updateTrafficLight();
        });

    // 拖拽功能
    const draggables = document.querySelectorAll(".draggable");
    const container = document.getElementById("time-adjust");

    draggables.forEach((draggable) => {
        draggable.addEventListener("dragstart", () => {
            draggable.classList.add("dragging");
        });

        draggable.addEventListener("dragend", async () => {
            draggable.classList.remove("dragging");
            lightSequence = Array.from(container.children).map((child) =>
                child.id.replace("adjust-", "")
            );
            await updateSetting(
                currentSettingId,
                trafficLightSettings[currentSettingId]
            );
        });
    });

    container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
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

    function countdown() {
        const now = Date.now();
        const elapsed = Math.floor((now - lastUpdateTime) / 1000);

        if (elapsed >= 1) {
            remainingSeconds -= elapsed;
            lastUpdateTime = now;

            if (remainingSeconds <= 0) {
                const setting = trafficLightSettings[currentSettingId];
                let nextIndex = lightSequence.indexOf(currentLight) + 1;
                while (nextIndex !== lightSequence.indexOf(currentLight)) {
                    if (nextIndex >= lightSequence.length) {
                        nextIndex = 0;
                    }
                    const nextLight = lightSequence[nextIndex];
                    if (setting[`${nextLight.replace("-", "_")}_seconds`] > 0) {
                        currentLight = nextLight;
                        remainingSeconds =
                            setting[
                                `${currentLight.replace("-", "_")}_seconds`
                            ];
                        break;
                    }
                    nextIndex++;
                }
                updateTrafficLight();
            }

            updateCountdown();
        }

        requestAnimationFrame(countdown);
    }

    calculateRemainingSeconds();
    updateTrafficLight();
    updateCountdown();
    updateOffsetDisplay();
    updateCurrentSettings();
    requestAnimationFrame(countdown);
}

// 调用初始化函数
initializeSettings();
