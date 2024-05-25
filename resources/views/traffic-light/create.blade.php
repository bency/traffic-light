<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Traffic Light</title>
    @vite(['resources/css/app.css', 'resources/js/traffic-light-create.js'])
</head>

<body>
    @include('layouts.navbar')
    <div class="container">
        <h1 class="my-4">Create Traffic Light</h1>

        <div class="mb-4">
            <label for="county" class="form-label">County:</label>
            <select id="county" name="county" class="form-control">
                <option value="">Select County</option>
            </select>
        </div>

        <div class="mb-4">
            <label for="district" class="form-label">District:</label>
            <select id="district" name="district" class="form-control" disabled>
                <option value="">Select District</option>
            </select>
        </div>

        <div class="mb-4">
            <label for="road" class="form-label">Road:</label>
            <input type="text" id="road" name="road" class="form-control">
            <select id="road-results" class="form-control mt-2" size="5" style="display: none;"></select>
        </div>

        <button id="create-button" class="btn btn-primary">Create</button>
    </div>
</body>

</html>
