# Inertia.js HTML Adapter

[![Npm package version](https://badgen.net/npm/v/inertia-html)](https://npmjs.com/package/inertia-html)
[![Npm package total downloads](https://badgen.net/npm/dt/inertia-html)](https://npmjs.com/package/inertia-html)
[![GitHub license](https://badgen.net/github/license/rogervila/inertia-html)](https://github.com/rogervila/inertia-html/blob/main/LICENSE)

<p align="center"><img src="https://i.ibb.co/Jyf7N95/inertia-html.png" alt="https://github.com/rogervila/inertia-html" loading="lazy" /></p>

Inertia.js HTML Adapter renders plain HTML files, including its script tags.

This strategy allows you to use any frontend library or framework the same way you would do in traditional server rendered HTML views.

> Check the Examples section to see how to use popular frontend libraries like jQuery and Alpine.js

## Install

> This section is based on [Laravel server-side](https://inertiajs.com/server-side-setup) adapter.

First, install the adapter with NPM or Yarn

```sh
npm install @inertiajs/inertia inertia-html
yarn add @inertiajs/inertia inertia-html
```

Then, import and run `createInertiaApp` from your `resources/js/app.js` file.

```js
/* resources/js/app.js */

import { createInertiaApp } from 'inertia-html'

createInertiaApp({
    resolve: name => require(`./Pages/${name}.html`),
    setup({ el, isServer, load, props }) {
        load({ target: el, isServer, props })
    },
})
```

## Usage

Inertia HTML adapter behaves like the [Inertia official client adapters](https://inertiajs.com/client-side-setup)

> This section is based on [Laravel server-side](https://inertiajs.com/server-side-setup) adapter.

### Pages

Let's create a Welcome Page on the `resources/js/Pages/Welcome.html` path:

```html
<!-- resources/js/Pages/Welcome.html -->

<!-- HTML does not need to be wrapped around any element -->
<h1>Welcome</h1>

<pre>rendered at <time id="date"></time></pre>

<script>
    /* Script tags are loaded with the page */

    /**
     * To simplify script tags loading and event handling,
     * Inertia HTML Adapter will try execute a function with
     * the page name, if present.
     * ie: for "Welcome.html", it will try to run "Welcome()"
     */
    function Welcome() {
        console.log('Welcome!')
        document.querySelector('#date').innerText = new Date().toTimeString()
    }
</script>

```

Now, add a route that renders the `Welcome.html` page with inertia:

```php
<?php

/* routes/web.php */

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});
```

Done. You are now rendering plain HTML files with Inertia.

### Links

Any tag that contains a `[data-inertia-link]` attribute will be considered as a _link_, and will be redirected to its _href_ when it recieves a click event.

Let's add some links on the previously created `Welcome.html` page:

```html
<!-- resources/js/Pages/Welcome.html -->

<!-- ... -->
<h1>Welcome</h1>

<nav>
    <a data-inertia-link href="/">Welcome</a>
    <a data-inertia-link href="/about">About</a>
</nav>

<pre>rendered at <time id="date"></time></pre>

<!-- ... -->

```

Also, create the `About.html` page and add it to the routes file:

```html
<!-- resources/js/Pages/About.html -->

<h1>About</h1>

<nav>
    <a data-inertia-link href="/">Welcome</a>
    <a data-inertia-link href="/about">About</a>
</nav>

<pre>rendered at <time id="date"></time></pre>

<script>
    function About() {
        console.log('About!')
        document.querySelector('#date').innerText = new Date().toTimeString()
    }
</script>
```

```php
<?php

/* routes/web.php */

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/about', function () {
    return Inertia::render('About');
});
```

Links accept a JSON string where you can pass any parameter that you could pass to the `Inertia.visit()`, like the HTTP method.

> Check [Inertia.js Manual Visits section](https://inertiajs.com/manual-visits) for further information.

#### POST Requests

> This example applies also for other HTTP Verbs like PUT, PATCH and DELETE

As an example, let's do a POST request.

First, add a POST route on `routes/web.php` that logs a message and then redirects back.

```php
/* routes/web.php */

/* ... */

Route::post('/message', function () {
    \Log::info('POST request from Inertia.js HTML Adapter!');
    return redirect()->back();
});
```

Now, on the `Welcome.html` page, let's add a button that just sends the post request.

```html
<!-- resources/js/Pages/Welcome.html -->

<!-- ... -->
<h1>Welcome</h1>

<nav>
    <a data-inertia-link href="/">Welcome</a>
    <a data-inertia-link href="/about">About</a>
</nav>

<button data-inertia-link='{"href": "/message", "method": "post"}'>Send a POST Request</button>

<!-- ... -->
```

Notice that the "rendered at" date changes when the POST request is sent. This is because Inerta renders again the current page.

Also, check your Laravel logs to assert that the message has been logged.

## Examples

Since Inertia.js HTML Adapter renders plain HTML files, you can use _any_ frontend library or framework with it.

> To simplify the examples, external libraries are loaded via CDN.

> This section is based on [Laravel server-side](https://inertiajs.com/server-side-setup) adapter.

### Alpine.js

[Alpine.js](https://alpinejs.dev/) is a lightweight JavaScript framework created by @calebporzio, who also created [Laravel Livewire](https://laravel-livewire.com/)

In order to use it with Inertia, add the script on the head tag of `resources/views/app.blade.php`

```html
<!-- resources/views/app.blade.php -->
<!DOCTYPE html>
<html>
    <head>
        <!-- ... -->
        <script src="//unpkg.com/alpinejs" defer></script>
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
```

Now, modify the `Welcome.html` page to use Alpine.js instead of plain javascript.

```html
<!-- resources/js/Pages/Welcome.html -->

<!-- ... -->

<pre x-data="Footer">rendered at <time x-html="date"></time></pre>

<script>
    /** The Welcome function can be deleted if you want **/
    function Welcome() {
        console.log('Welcome!')
    }

    function Footer() {
        return {
            date: new Date().toTimeString()
        }
    }
</script>

```

### jQuery

Old but gold, [jQuery](https://code.jquery.com/) is still an option for those who have not been on the frontend development loop during the last years.

Add the jQuery script on the head tag of `resources/views/app.blade.php`

```html
<!-- resources/views/app.blade.php -->
<!DOCTYPE html>
<html>
    <head>
        <!-- ... -->
        <script
            src="https://code.jquery.com/jquery-3.6.0.min.js"
            integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
            crossorigin="anonymous"></script>
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
```

Now, modify the `Welcome.html` page to use jQuery instead of plain javascript.

```html
<!-- resources/js/Pages/Welcome.html -->

<!-- ... -->

<pre>rendered at <time id="date"></time></pre>

<script>
    /* ... */
    function Welcome() {
        console.log('Welcome!')
        $('#date').html(new Date().toTimeString())
    }
</script>
```
