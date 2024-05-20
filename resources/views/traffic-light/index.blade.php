<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traffic Light Countdown</title>
    @vite(['resources/css/traffic-light.css', 'resources/js/traffic-light.js'])
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
                <button id="decrease-offset-5">減少5秒</button>
                <button id="decrease-offset">減少1秒</button>
                <button id="increase-offset">增加1秒</button>
                <button id="increase-offset-5">增加5秒</button>
            </div>
            <div id="offset-display">偏移量: 0 秒</div>
            <div class="time-adjust-container">
                <h3>調整燈號時間</h3>
                <div id="time-adjust">
                    <div class="draggable" id="adjust-red" draggable="true">
                        紅燈: <span id="red-time">30</span> 秒
                        <div class="adjust-buttons">
                            <button class="decrease-time-5">-5</button>
                            <button class="decrease-time">-1</button>
                            <button class="increase-time">+1</button>
                            <button class="increase-time-5">+5</button>
                        </div>
                    </div>
                    <div class="draggable" id="adjust-green" draggable="true">
                        綠燈: <span id="green-time">25</span> 秒
                        <div class="adjust-buttons">
                            <button class="decrease-time-5">-5</button>
                            <button class="decrease-time">-1</button>
                            <button class="increase-time">+1</button>
                            <button class="increase-time-5">+5</button>
                        </div>
                    </div>
                    <div class="draggable" id="adjust-yellow" draggable="true">
                        黃燈: <span id="yellow-time">5</span> 秒
                        <div class="adjust-buttons">
                            <button class="decrease-time-5">-5</button>
                            <button class="decrease-time">-1</button>
                            <button class="increase-time">+1</button>
                            <button class="increase-time-5">+5</button>
                        </div>
                    </div>
                    <div class="draggable" id="adjust-left-green" draggable="true">
                        左轉綠燈: <span id="left-green-time">0</span> 秒
                        <div class="adjust-buttons">
                            <button class="decrease-time-5">-5</button>
                            <button class="decrease-time">-1</button>
                            <button class="increase-time">+1</button>
                            <button class="increase-time-5">+5</button>
                        </div>
                    </div>
                    <div class="draggable" id="adjust-straight-green" draggable="true">
                        直行綠燈: <span id="straight-green-time">0</span> 秒
                        <div class="adjust-buttons">
                            <button class="decrease-time-5">-5</button>
                            <button class="decrease-time">-1</button>
                            <button class="increase-time">+1</button>
                            <button class="increase-time-5">+5</button>
                        </div>
                    </div>
                    <div class="draggable" id="adjust-right-green" draggable="true">
                        右轉綠燈: <span id="right-green-time">0</span> 秒
                        <div class="adjust-buttons">
                            <button class="decrease-time-5">-5</button>
                            <button class="decrease-time">-1</button>
                            <button class="increase-time">+1</button>
                            <button class="increase-time-5">+5</button>
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
    @vite(['resources/css/traffic-light.css', 'resources/js/traffic-light.js'])
</body>

</html>
