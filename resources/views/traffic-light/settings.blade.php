<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traffic Light Settings</title>
    @vite(['resources/css/app.css', 'resources/js/traffic-light-settings.js'])
</head>

<body>
    <div class="container">
        <h1>Traffic Light Settings</h1>

        <div class="filters">
            <label for="county">County:</label>
            <input type="text" id="county" name="county">

            <label for="district">District:</label>
            <input type="text" id="district" name="district">

            <label for="road">Road:</label>
            <input type="text" id="road" name="road">
        </div>

        <table>
            <thead>
                <tr>
                    <th>County</th>
                    <th>District</th>
                    <th>Connected Roads</th>
                    <th>Heading</th>
                </tr>
            </thead>
            <tbody id="settings-table-body">
                <!-- Data will be populated here -->
            </tbody>
        </table>
    </div>
</body>

</html>
