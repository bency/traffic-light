<!-- resources/views/layouts/navbar.blade.php -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">交通燈設置</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link {{ request()->is('/') ? 'active' : '' }}" href="{{ url('/') }}">首頁</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request()->is('traffic-light/create') ? 'active' : '' }}"
                        href="{{ url('traffic-light/create') }}">新增設定</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request()->is('traffic-light/settings') ? 'active' : '' }}"
                        href="{{ url('traffic-light/settings') }}">設置</a>
                </li>
            </ul>
            <span class="navbar-text">
                @if(request()->is('/'))
                目前頁面：首頁
                @elseif(request()->is('traffic-light/create'))
                目前頁面：新增設定
                @elseif(request()->is('traffic-light/settings'))
                目前頁面：設置
                @endif
            </span>
        </div>
    </div>
</nav>
