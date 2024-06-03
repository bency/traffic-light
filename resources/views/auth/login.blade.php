<x-guest-layout>
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('login') }}">
        @csrf

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('Email')" />
            <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required
                autofocus autocomplete="username" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div class="mt-4">
            <x-input-label for="password" :value="__('Password')" />

            <x-text-input id="password" class="block mt-1 w-full" type="password" name="password" required
                autocomplete="current-password" />

            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Remember Me -->
        <div class="block mt-4">
            <label for="remember_me" class="inline-flex items-center">
                <input id="remember_me" type="checkbox"
                    class="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
                    name="remember">
                <span class="ms-2 text-sm text-gray-600 dark:text-gray-400">{{ __('Remember me') }}</span>
            </label>
        </div>

        <div class="flex items-center justify-end mt-4">
            @if (Route::has('password.request'))
            <a class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                href="{{ route('password.request') }}">
                {{ __('Forgot your password?') }}
            </a>
            @endif

            <x-primary-button class="ms-3">
                {{ __('Log in') }}
            </x-primary-button>
        </div>
    </form>

    <!-- Google Login Button -->
    <div class="flex items-center justify-center mt-6">
        <a href="{{ route('auth.google') }}" class="btn btn-primary w-full text-center">
            <svg class="w-5 h-5 inline-block mr-2" viewBox="0 0 48 48">
                <path
                    d="M24 9.5c3.2 0 6 .9 8.4 2.6L37.8 8C33.8 5 29.1 3 24 3 14.8 3 7 8.9 3.8 17h8.4c1.7-4.4 5.9-7.5 10.8-7.5z"
                    fill="#EA4335" />
                <path
                    d="M46.2 24c0-1.5-.1-2.9-.4-4.3H24v8.2h12.7c-.6 3.3-2.5 6.1-5.2 8l7.9 6.2C43.7 38.3 46.2 31.7 46.2 24z"
                    fill="#4285F4" />
                <path
                    d="M12.2 28.1c-.9-2.3-1.5-4.8-1.5-7.4s.5-5.1 1.5-7.4l-8.4-6.5C1.2 11.3 0 15.6 0 20s1.2 8.7 3.8 12.1l8.4-6.5z"
                    fill="#FBBC05" />
                <path
                    d="M24 46c5.1 0 9.8-1.7 13.5-4.7L29.6 35c-1.7 1.1-3.8 1.7-5.6 1.7-4.9 0-9.1-3.1-10.8-7.5H4.8l-8.4 6.5c3.2 8.1 11 14 20.2 14z"
                    fill="#34A853" />
            </svg>
            {{ __('Login with Google') }}
        </a>
    </div>
</x-guest-layout>
