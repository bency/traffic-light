<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Traffic Light</title>
    @vite(['resources/css/app.css', 'resources/js/traffic-light-edit.js'])
</head>

<body>
    <div class="container">
        <h1 class="my-4">Edit Traffic Light</h1>
        <div id="traffic-light-preview">
            <!-- Traffic light preview -->
        </div>
        <div class="mb-4">
            <label for="red-seconds" class="form-label">Red Light Seconds:</label>
            <input type="number" id="red-seconds" class="form-control" value="30">
        </div>
        <!-- More fields for yellow, green, etc. -->
        <button id="save-button" class="btn btn-primary">Save</button>
    </div>
</body>

</html>
