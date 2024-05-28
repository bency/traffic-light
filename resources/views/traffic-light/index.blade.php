<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traffic Light Countdown</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    @vite(['resources/css/traffic-light.css', 'resources/js/traffic-light.js', 'resources/css/app.css'])
</head>

<body>
    @include('layouts.navbar')
    <div class="container mt-5">
        <div class="row mb-3">
            <div class="col-md-12">
                <div id="current-setting-name" class="text-center"></div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-12 text-center">
                <div id="traffic-light-container">
                    <div id="traffic-light">
                        <div class="light" id="red-light"></div>
                        <div class="light" id="yellow-light"></div>
                        <div class="light" id="green-light"></div>
                        <div class="light" id="left-green-light">
                            <i class="fas fa-arrow-left"></i>
                        </div>
                        <div class="light" id="straight-green-light">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <div class="light" id="right-green-light">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                    <div id="countdown" class="mt-3"></div>
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-12 text-center">
                <div class="button-container"></div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-md-12">
                <div class="time-adjust-container">
                    <div id="time-adjust" class="row">
                        <div class="mb-3">
                            <div class="draggable p-3 border" id="adjust-red">
                                偏移: <span id="offset-display">0</span> 秒
                                <div class="adjust-buttons mt-2">
                                    <button class="btn btn-sm btn-outline-secondary me-1"
                                        id="decrease-offset-5">-5</button>
                                    <button class="btn btn-sm btn-outline-secondary me-1"
                                        id="decrease-offset">-1</button>
                                    <button class="btn btn-sm btn-outline-secondary me-1"
                                        id="increase-offset">+1</button>
                                    <button class="btn btn-sm btn-outline-secondary" id="increase-offset-5">+5</button>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="draggable p-3 border" id="adjust-red">
                                紅燈: <span id="red-time">30</span> 秒
                                <div class="adjust-buttons mt-2">
                                    <button class="btn decrease-time-5 btn-sm btn-outline-danger me-1">-5</button>
                                    <button class="btn decrease-time btn-sm btn-outline-danger me-1">-1</button>
                                    <button class="btn increase-time btn-sm btn-outline-danger me-1">+1</button>
                                    <button class="btn increase-time-5 btn-sm btn-outline-danger">+5</button>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="draggable p-3 border" id="adjust-green">
                                綠燈: <span id="green-time">25</span> 秒
                                <div class="adjust-buttons mt-2">
                                    <button class="btn decrease-time-5 btn-sm btn-outline-success me-1">-5</button>
                                    <button class="btn decrease-time btn-sm btn-outline-success me-1">-1</button>
                                    <button class="btn increase-time btn-sm btn-outline-success me-1">+1</button>
                                    <button class="btn increase-time-5 btn-sm btn-outline-success">+5</button>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="draggable p-3 border" id="adjust-left-green">
                                左轉: <span id="left-green-time">0</span> 秒
                                <div class="adjust-buttons mt-2">
                                    <button class="btn decrease-time-5 btn-sm btn-outline-primary me-1">-5</button>
                                    <button class="btn decrease-time btn-sm btn-outline-primary me-1">-1</button>
                                    <button class="btn increase-time btn-sm btn-outline-primary me-1">+1</button>
                                    <button class="btn increase-time-5 btn-sm btn-outline-primary">+5</button>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="draggable p-3 border" id="adjust-straight-green">
                                直行: <span id="straight-green-time">0</span> 秒
                                <div class="adjust-buttons mt-2">
                                    <button class="btn decrease-time-5 btn-sm btn-outline-info me-1">-5</button>
                                    <button class="btn decrease-time btn-sm btn-outline-info me-1">-1</button>
                                    <button class="btn increase-time btn-sm btn-outline-info me-1">+1</button>
                                    <button class="btn increase-time-5 btn-sm btn-outline-info">+5</button>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="draggable p-3 border" id="adjust-right-green">
                                右轉: <span id="right-green-time">0</span> 秒
                                <div class="adjust-buttons mt-2">
                                    <button class="btn decrease-time-5 btn-sm btn-outline-secondary me-1">-5</button>
                                    <button class="btn decrease-time btn-sm btn-outline-secondary me-1">-1</button>
                                    <button class="btn increase-time btn-sm btn-outline-secondary me-1">+1</button>
                                    <button class="btn increase-time-5 btn-sm btn-outline-secondary">+5</button>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="draggable p-3 border" id="adjust-yellow">
                                黃燈: <span id="yellow-time">5</span> 秒
                                <div class="adjust-buttons mt-2">
                                    <button class="btn decrease-time-5 btn-sm btn-outline-warning me-1">-5</button>
                                    <button class="btn decrease-time btn-sm btn-outline-warning me-1">-1</button>
                                    <button class="btn increase-time btn-sm btn-outline-warning me-1">+1</button>
                                    <button class="btn increase-time-5 btn-sm btn-outline-warning">+5</button>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="time-range p-3 border">
                                <label for="start-time" class="form-label">開始時間:</label>
                                <input type="time" id="start-time" class="form-control">
                                <label for="end-time" class="form-label mt-2">結束時間:</label>
                                <input type="time" id="end-time" class="form-control">
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="heading-selection p-3 border">
                                <label for="heading" class="form-label">方向:</label>
                                <select id="heading" class="form-select">
                                    <option value="N">往北</option>
                                    <option value="NE">往東北</option>
                                    <option value="E">往東</option>
                                    <option value="SE">往東南</option>
                                    <option value="S">往南</option>
                                    <option value="SW">往西南</option>
                                    <option value="W">往西</option>
                                    <option value="NW">往西北</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-12">
                <div class="traffic-settings border p-3" id="traffic-settings">
                    <div id="current-settings" class="mb-3">
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
                    <div id="settings-options" class="mb-3">
                        <h3>可選週期</h3>
                        <!-- 這些選項可以根據需求動態生成 -->
                    </div>
                    <div>
                        <input type="text" id="new-cycle-name" class="form-control mb-2" placeholder="輸入週期名稱">
                        <button id="add-cycle" class="btn btn-primary">新增週期</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
