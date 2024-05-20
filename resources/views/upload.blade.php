<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload CSV File</title>
</head>

<body>
    <h1>Upload CSV File</h1>

    @if (session('success'))
    <p>{{ session('success') }}</p>
    @endif

    <form action="{{ route('traffic-light-locations.upload') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <input type="file" name="file" required>
        <button type="submit">Upload</button>
    </form>
</body>

</html>
