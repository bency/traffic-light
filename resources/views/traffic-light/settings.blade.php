<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traffic Light Settings</title>
    <link rel="icon" href="/path/to/favicon.ico" type="image/x-icon">
    @vite(['resources/css/app.css', 'resources/js/traffic-light-settings.js'])
</head>

<body>
    @include('layouts.navbar')
    <div class="container">
        <h1 class="my-4">Traffic Light Settings</h1>

        <div class="filters mb-4">
            <div class="mb-3">
                <label for="county" class="form-label">County:</label>
                <select id="county" name="county" class="form-control">
                    <option value="">Select County</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="district" class="form-label">District:</label>
                <select id="district" name="district" class="form-control" disabled>
                    <option value="">Select District</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="road" class="form-label">Road:</label>
                <input type="text" id="road" name="road" class="form-control">
            </div>
        </div>

        <table class="table table-striped">
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
