<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traffic Light Countdown</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .top {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        .bottom {
            width: 100%;
            border-top: 1px solid #ccc;
            padding: 20px;
        }
        #traffic-light-container {
            display: flex;
            align-items: center;
        }
        #countdown {
            font-size: 2em;
            margin: 20px;
        }
        .light {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin: 10px;
            display: inline-block;
            position: relative;
        }
        .red {
            background-color: red;
        }
        .green {
            background-color: green;
        }
        .yellow {
            background-color: yellow;
        }
        .left-green {
            background-color: lightgreen;
        }
        .straight-green {
            background-color: limegreen;
        }
        .right-green {
            background-color: darkgreen;
        }
        .left-arrow, .straight-arrow, .right-arrow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            color: white;
        }
        .button-container, .time-adjust-container {
            margin: 20px;
        }
        .settings {
            display: flex;
            justify-content: space-between;
        }
        .traffic-settings {
            width: 300px;
            padding: 10px;
        }
        .setting-option {
            margin: 10px 0;
            cursor: pointer;
        }
        .adjust-buttons {
            display: flex;
            justify-content: space-between;
            width: 100px;
        }
        .draggable {
            cursor: move;
            margin: 10px;
            padding: 5px;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
        }
        #current-setting-name {
            font-size: 1.5em;
            margin-bottom: 10px;
        }
        .hidden {
            display: none;
        }
        .delete-button {
            background-color: red;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            margin-left: 10px;
        }
        .control-container {
            display: flex;
            align-items: center;
        }
        .control-container label {
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="top">
            <div id="current-setting-name"></div>
            <div id="traffic-light-container">
                <div id="traffic-light">
                    <div class="light red" id="red-light"></div>
                    <div class="light yellow" id="yellow-light"></div>
                    <div class="light green" id="green-light"></div>
                    <div class="light left-green" id="left-green-light">
                        <span class="left-arrow">←</span>
                    </div>
                    <div class="light straight-green" id="straight-green-light">
                        <span class="straight-arrow">↑</span>
                    </div>
                    <div class="light right-green" id="right-green-light">
                        <span class="right-arrow">→</span>
                    </div>
                </div>
                <div id="countdown"></div>
            </div>
            <div class="button-container">
                <button id="increase-offset">增加1秒</button>
                <button id="decrease-offset">減少1秒</button>
            </div>
            <div id="offset-display">偏移量: 0 秒</div>
            <div class="time-adjust-container">
                <h3>調整燈號時間</h3>
                <div id="time-adjust">
                    <div class="draggable" id="adjust-red" draggable="true">
                        紅燈: <span id="red-time">30</span> 秒
                        <div class="adjust-buttons">
                            <button class="increase-time">+</button>
                            <button class="decrease-time">-</button>
                        </div>
                    </div>
                    <div class="draggable" id="adjust-green" draggable="true">
                        綠燈: <span id="green-time">25</span> 秒
                        <div class="adjust-buttons">
                            <button class="increase-time">+</button>
                            <button class="decrease-time">-</button>
                        </div>
                    </div>
                    <div class="draggable" id="adjust-yellow" draggable="true">
                        黃燈: <span id="yellow-time">5</span> 秒
                        <div class="adjust-buttons">
                            <button class="increase-time">+</button>
                            <button class="decrease-time">-</button>
                        </div>
                    </div>
                    <div class="draggable" id="adjust-left-green" draggable="true">
                        左轉綠燈: <span id="left-green-time">0</span> 秒
                        <div class="adjust-buttons">
                            <button class="increase-time">+</button>
                            <button class="decrease-time">-</button>
                        </div>
                    </div>
                    <div class="draggable" id="adjust-straight-green" draggable="true">
                        直行綠燈: <span id="straight-green-time">0</span> 秒
                        <div class="adjust-buttons">
                            <button class="increase-time">+</button>
                            <button class="decrease-time">-</button>
                        </div>
                    </div>
                    <div class="draggable" id="adjust-right-green" draggable="true">
                        右轉綠燈: <span id="right-green-time">0</span> 秒
                        <div class="adjust-buttons">
                            <button class="increase-time">+</button>
                            <button class="decrease-time">-</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="control-container">
                <label for="show-left-arrow">
                    <input type="checkbox" id="show-left-arrow" checked> 左轉箭頭
                </label>
                <label for="show-right-arrow">
                    <input type="checkbox" id="show-right-arrow" checked> 右轉箭頭
                </label>
            </div>
        </div>
        <div class="bottom">
            <div class="traffic-settings" id="traffic-settings">
                <div id="current-settings">
                    <h3>目前週期</h3>
                    <p>紅燈: <span id="current-red"></span> 秒</p>
                    <p>黃燈: <span id="current-yellow"></span> 秒</p>
                    <p>綠燈: <span id="current-green"></span> 秒</p>
                    <p>左轉綠燈: <span id="current-left-green"></span> 秒</p>
                    <p>直行綠燈: <span id="current-straight-green"></span> 秒</p>
                    <p>右轉綠燈: <span id="current-right-green"></span> 秒</p>
                    <p>總時間: <span id="current-total"></span> 秒</p>
                    <p>偏移量: <span id="current-offset"></span> 秒</p>
                </div>
                <div id="settings-options">
                    <h3>可選週期</h3>
                    <!-- 這些選項可以根據需求動態生成 -->
                </div>
                <div>
                    <input type="text" id="new-cycle-name" placeholder="輸入週期名稱">
                    <button id="add-cycle">新增週期</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 从 localStorage 中读取数据，如果没有则使用默认值
        const savedSettings = JSON.parse(localStorage.getItem('trafficLightSettings')) || {
            1: { name: "週期1", red_seconds: 30, yellow_seconds: 5, green_seconds: 25, left_green_seconds: 0, straight_green_seconds: 0, right_green_seconds: 0, offset: 0 },
            2: { name: "週期2", red_seconds: 20, yellow_seconds: 4, green_seconds: 16, left_green_seconds: 0, straight_green_seconds: 0, right_green_seconds: 0, offset: 0 },
            3: { name: "週期3", red_seconds: 40, yellow_seconds: 6, green_seconds: 34, left_green_seconds: 0, straight_green_seconds: 0, right_green_seconds: 0, offset: 0 }
        };

        let trafficLightSettings = JSON.parse(JSON.stringify(savedSettings));

        let currentSettingId = Object.keys(trafficLightSettings)[0];
        let remainingSeconds = trafficLightSettings[currentSettingId].red_seconds;
        let lastUpdateTime = Date.now();
        let offset = trafficLightSettings[currentSettingId].offset; // 确保加载时读取偏移量
        let lightSequence = ["red", "green", "left-green", "straight-green", "right-green", "yellow"];

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
            const cycleDuration = lightSequence.reduce((sum, light) => sum + trafficLightSettings[currentSettingId][`${light.replace('-', '_')}_seconds`], 0);

            let timeInCurrentCycle = elapsedTime % cycleDuration;
            for (const light of lightSequence) {
                const lightDuration = trafficLightSettings[currentSettingId][`${light.replace('-', '_')}_seconds`];
                if (timeInCurrentCycle < lightDuration) {
                    currentLight = light;
                    remainingSeconds = lightDuration - timeInCurrentCycle;
                    break;
                }
                timeInCurrentCycle -= lightDuration;
            }
        }

        function updateTrafficLight() {
            document.querySelectorAll('.light').forEach(light => {
                light.style.opacity = 0.3;
                light.style.display = 'none'; // 默认隐藏
            });

            document.getElementById(`${currentLight}-light`).style.opacity = 1;
            document.getElementById(`${currentLight}-light`).style.display = 'inline-block';

            if (currentLight === 'red') {
                if (showLeftGreenWithRed && trafficLightSettings[currentSettingId].left_green_seconds > 0) {
                    document.getElementById('left-green-light').style.display = 'inline-block';
                    document.getElementById('left-green-light').style.opacity = 1;
                }
                if (showRightGreenWithRed && trafficLightSettings[currentSettingId].right_green_seconds > 0) {
                    document.getElementById('right-green-light').style.display = 'inline-block';
                    document.getElementById('right-green-light').style.opacity = 1;
                }
            }
        }

        function updateCountdown() {
            document.getElementById('countdown').innerText = `剩餘秒數: ${remainingSeconds}`;
        }

        function updateOffsetDisplay() {
            document.getElementById('offset-display').innerText = `偏移量: ${offset} 秒`;
            document.getElementById('current-offset').innerText = offset;
        }

        function updateCurrentSettings() {
            const setting = trafficLightSettings[currentSettingId];
            document.getElementById('current-setting-name').innerText = setting.name;
            document.getElementById('current-red').innerText = setting.red_seconds;
            document.getElementById('current-yellow').innerText = setting.yellow_seconds;
            document.getElementById('current-green').innerText = setting.green_seconds;
            document.getElementById('current-left-green').innerText = setting.left_green_seconds;
            document.getElementById('current-straight-green').innerText = setting.straight_green_seconds;
            document.getElementById('current-right-green').innerText = setting.right_green_seconds;
            document.getElementById('current-total').innerText = lightSequence.reduce((sum, light) => sum + setting[`${light.replace('-', '_')}_seconds`], 0);
            document.getElementById('current-offset').innerText = setting.offset;
            document.getElementById('red-time').innerText = setting.red_seconds;
            document.getElementById('yellow-time').innerText = setting.yellow_seconds;
            document.getElementById('green-time').innerText = setting.green_seconds;
            document.getElementById('left-green-time').innerText = setting.left_green_seconds;
            document.getElementById('straight-green-time').innerText = setting.straight_green_seconds;
            document.getElementById('right-green-time').innerText = setting.right_green_seconds;
            updateSettingsOptions();
        }

        function updateSettingsOptions() {
            const settingsOptions = document.getElementById('settings-options');
            settingsOptions.innerHTML = ''; // 清空现有选项

            Object.keys(trafficLightSettings).forEach(id => {
                const setting = trafficLightSettings[id];
                const option = document.createElement('div');
                option.className = 'setting-option';
                option.dataset.id = id;
                option.dataset.red = setting.red_seconds;
                option.dataset.yellow = setting.yellow_seconds;
                option.dataset.green = setting.green_seconds;
                option.dataset.leftGreen = setting.left_green_seconds;
                option.dataset.straightGreen = setting.straight_green_seconds;
                option.dataset.rightGreen = setting.right_green_seconds;
                option.innerText = `${setting.name}: 紅燈: ${setting.red_seconds}秒, 黃燈: ${setting.yellow_seconds}秒, 綠燈: ${setting.green_seconds}秒, 左轉綠燈: ${setting.left_green_seconds}秒, 直行綠燈: ${setting.straight_green_seconds}秒, 右轉綠燈: ${setting.right_green_seconds}秒`;
                
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.innerText = '刪除';
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteTrafficLightSetting(id);
                });

                option.appendChild(deleteButton);
                option.addEventListener('click', () => {
                    changeTrafficLightSettings(parseInt(id));
                });

                settingsOptions.appendChild(option);
            });
        }

        function adjustOffset(amount) {
            offset += amount;
            trafficLightSettings[currentSettingId].offset = offset; // 保存偏移量
            saveSettingsToLocalStorage();
            calculateRemainingSeconds(); // 重新计算剩余时间
            updateCountdown(); // 即时更新倒数计时
            updateOffsetDisplay(); // 即时更新偏移量显示
        }

        function changeTrafficLightSettings(id) {
            currentSettingId = id;
            offset = trafficLightSettings[currentSettingId].offset;
            calculateRemainingSeconds();
            lastUpdateTime = Date.now();
            updateTrafficLight();
            updateCountdown();
            updateOffsetDisplay();
            updateCurrentSettings();
        }

        function saveSettingsToLocalStorage() {
            localStorage.setItem('trafficLightSettings', JSON.stringify(trafficLightSettings));
        }

        function adjustTime(light, amount) {
            const timeSpan = document.getElementById(`${light}-time`);
            let currentTime = parseInt(timeSpan.innerText);
            currentTime += amount;
            if (currentTime < 0) currentTime = 0;
            timeSpan.innerText = currentTime;
            trafficLightSettings[currentSettingId][`${light.replace('-', '_')}_seconds`] = currentTime;
            saveSettingsToLocalStorage();
            calculateRemainingSeconds(); // 确保时间调整后重新计算剩余时间
            updateCurrentSettings();
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
                        if (setting[`${nextLight.replace('-', '_')}_seconds`] > 0) {
                            currentLight = nextLight;
                            remainingSeconds = setting[`${currentLight.replace('-', '_')}_seconds`];
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

        function deleteTrafficLightSetting(id) {
            delete trafficLightSettings[id];
            saveSettingsToLocalStorage();
            updateSettingsOptions();
            const remainingKeys = Object.keys(trafficLightSettings);
            if (remainingKeys.length > 0) {
                currentSettingId = remainingKeys[0];
            } else {
                addDefaultCycle();
            }
            calculateRemainingSeconds();
            updateTrafficLight();
            updateCountdown();
            updateOffsetDisplay();
            updateCurrentSettings();
        }

        function addDefaultCycle() {
            const newId = new Date().getTime(); // 用时间戳生成唯一ID
            trafficLightSettings[newId] = {
                name: "默认週期",
                red_seconds: 30,
                yellow_seconds: 3,
                green_seconds: 30,
                left_green_seconds: 0,
                straight_green_seconds: 0,
                right_green_seconds: 0,
                offset: 0
            };
            saveSettingsToLocalStorage();
            currentSettingId = newId;
            updateSettingsOptions();
        }

        document.getElementById('increase-offset').addEventListener('click', () => adjustOffset(1));
        document.getElementById('decrease-offset').addEventListener('click', () => adjustOffset(-1));
        document.querySelectorAll('.increase-time').forEach(button => {
            button.addEventListener('click', () => {
                const light = button.parentElement.parentElement.id.replace('adjust-', '');
                adjustTime(light, 1);
            });
        });
        document.querySelectorAll('.decrease-time').forEach(button => {
            button.addEventListener('click', () => {
                const light = button.parentElement.parentElement.id.replace('adjust-', '');
                adjustTime(light, -1);
            });
        });

        document.getElementById('add-cycle').addEventListener('click', () => {
            const name = document.getElementById('new-cycle-name').value.trim();
            if (name === '') {
                alert('請輸入週期名稱');
                return;
            }
            const newId = new Date().getTime(); // 用时间戳生成唯一ID
            trafficLightSettings[newId] = {
                name: name,
                red_seconds: 30,
                yellow_seconds: 3,
                green_seconds: 30,
                left_green_seconds: 0,
                straight_green_seconds: 0,
                right_green_seconds: 0,
                offset: 0
            };
            saveSettingsToLocalStorage();
            document.getElementById('new-cycle-name').value = '';
            updateSettingsOptions();
        });

        document.getElementById('show-left-arrow').addEventListener('change', (e) => {
            showLeftGreenWithRed = e.target.checked;
            updateTrafficLight();
        });

        document.getElementById('show-right-arrow').addEventListener('change', (e) => {
            showRightGreenWithRed = e.target.checked;
            updateTrafficLight();
        });

        // 拖拽功能
        const draggables = document.querySelectorAll('.draggable');
        const container = document.getElementById('time-adjust');

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
            });

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
                lightSequence = Array.from(container.children).map(child => child.id.replace('adjust-', ''));
                saveSettingsToLocalStorage();
            });
        });

        container.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(container, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        calculateRemainingSeconds();
        updateTrafficLight();
        updateCountdown();
        updateOffsetDisplay();
        updateCurrentSettings();
        requestAnimationFrame(countdown);
    </script>
</body>
</html>

