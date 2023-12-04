# Screenshots

[Show Demo](https://rooom-com.github.io/demos/screenshot/)

> [!NOTE]
> This Demo mostly utilizes the `getScreenshot` method of the ProductViewerAPI.
> You can read more about it [here](https://developers.rooom.com/docs/rooom-products/viewer/viewer-api/general.html#getscreenshot).

## Goal

We want to build a simple tool to take rendered screenshots of a product viewer.
Users should be able to specify a resolution and get a client side rendered image.

## Implementation

### Base Structure

First at all we will create our base structure.
In here the first thing we do is import the product-viewer script from rooom.
We also import our stylesheet and javascript which we will define further on.

```html
<!-- index.html -->
<html>
	<head>
		<title>Screenshot</title>
		<script src="https://static.rooom.com/viewer-api/product-viewer-1.0.0.min.js"></script>
		<link rel="stylesheet" href="style.css" />
	</head>
	<body>
		<script src="script.js"></script>
	</body>
</html>
```

### Add an iFrame

In order to show our product viewer, we need to add an iFrame inside our html body.
We don't need to specify an `src` since the frame will be controlled by our script.
To use all features of the product viewer, the iFrame will also need some allowance as shown below.

```html
<body>
	<iframe
		id="iframe"
		src=""
		style="width: 100%; height: 100%"
		allow="autoplay; fullscreen; vr; xr"
		allowvr
		allowfullscreen
		mozallowfullscreen="true"
		webkitallowfullscreen="true"
	></iframe>

	<script src="script.js"></script>
</body>
```

### Layout

Next we will add our layout.
In this example we want to utilize html`s dialog element to show our interface.
Therefore we will define a dialog with inputs to specify a resolution and a button to take the screenshot.
To make usage easier, we also specify default values to render an 4K image.

```html
<body>
	<iframe
		id="iframe"
		src=""
		style="width: 100%; height: 100%"
		allow="autoplay; fullscreen; vr; xr"
		allowvr
		allowfullscreen
		mozallowfullscreen="true"
		webkitallowfullscreen="true"
	></iframe>

	<button id="dialogButton">Open Dialog</button>

	<dialog id="dialog">
		<div>
			<input id="width" type="number" placeholder="width" value="3840" />
			<span>x</span>
			<input id="height" type="number" placeholder="width" value="2160" />
			<button id="screenshotButton">Take Screenshot</button>
		</div>
	</dialog>

	<script src="script.js"></script>
</body>
```

---

### Mapping

Before we start implementing our business logic, we create some variables and structures to work with.
First at all we specify the id of our targeted product viewer and iframe as well as references to all needed elements.

```js
const viewerID = "e725a9e18cb87bbc2977b73d4bdc65";
const iframe = document.getElementById("iframe");
const buttonDialog = document.getElementById("dialogButton");
const buttonScreenshot = document.getElementById("screenshotButton");
const inputWidth = document.getElementById("width");
const inputHeight = document.getElementById("height");
const dialog = document.getElementById("dialog");
```

### Initialization

After we have our base setup, we can now start by initializing our product viewer with the api.
To tweak our viewer, we pass in some options to the init function.
Note that all of our logic should now go inside the viewers `onSuccess` function.

```js
const viewer = new ProductViewer(iframe);
viewer.init(viewerID, {
	autostart: true, // autostart the viewer
    render_background: true, // render even when not focused
    annotations: false, // Disable annotations
	onSuccess: function (api) {
		// logic goes here //
	}
});
```

> [!NOTE]
> A detailed list of all initialization options can be found [here](https://developers.rooom.com/docs/rooom-products/viewer/customization.html).

Since we want to interact with our viewer once it is loaded, we also need to start our logic after the viewer has started rendering.

```js
const viewer = new ProductViewer(iframe);
viewer.init(viewerID, {
	autostart: true, // autostart the viewer
    render_background: true, // render even when not focused
    annotations: false, // Disable annotations
	onSuccess: function (api) {
		api.on("viewer.start", function () {
			// logic goes here //
		});
	}
});
```

### Render Logic

With our base setup in place we can now implement our rendering logic.
The main idea is to read the given resolution from our input.
Then we want to resize the viewer to the resolution, take a screenshot and resize it back.
To do so, we first define a reset function for our iframe and call it at load:

```js
const viewer = new ProductViewer(iframe);
viewer.init(viewerID, {
	autostart: true, // autostart the viewer
    render_background: true, // render even when not focused
    annotations: false, // Disable annotations
	onSuccess: function (api) {
		api.on("viewer.start", function () {

            function resetIframe() {
                iframe.style.width = "100%";
                iframe.style.height = "100%";
            }
            resetIframe();

		});
	}
});
```

When adjusting the size of the iframe via javascript, in theory it should take two frames until the actual canvas gets adjusted.
One Frame to adjust the iframe itself and another one for the canvas inside it to react.
We can wait for those two frames by using `requestAnimationFrame`.
In order to get some cleaner Code, we create a helper function utilizing promises.

```js
const viewer = new ProductViewer(iframe);
viewer.init(viewerID, {
	autostart: true, // autostart the viewer
    render_background: true, // render even when not focused
    annotations: false, // Disable annotations
	onSuccess: function (api) {
		api.on("viewer.start", function () {

            function resetIframe() {
                iframe.style.width = "100%";
                iframe.style.height = "100%";
            }
            resetIframe();

            function waitForFrames(amount) {
                return new Promise((resolve) => {
                    function wait(n) {
                        if(n == 0) resolve();
                        else requestAnimationFrame(() => wait(n - 1));
                    }
                    wait(amount);
                });
            }
		});
	}
});
```

Lastly we need a helper for downloading our screenshot.
We will get our screenshot as an base64 encoded jpeg image.
To download it, we simply create a new element with the correct download link, click it and remove it afterwards.

```js
const viewer = new ProductViewer(iframe);
viewer.init(viewerID, {
	autostart: true, // autostart the viewer
    render_background: true, // render even when not focused
    annotations: false, // Disable annotations
	onSuccess: function (api) {
		api.on("viewer.start", function () {

            function resetIframe() {
                iframe.style.width = "100%";
                iframe.style.height = "100%";
            }
            resetIframe();

            function waitForFrames(amount) {
                return new Promise((resolve) => {
                    function wait(n) {
                        if(n == 0) resolve();
                        else requestAnimationFrame(() => wait(n - 1));
                    }
                    wait(amount);
                });
            }

            function downloadBase64(data, name) {
                const link = document.createElement("a");
                link.href = data;
                link.download = name;
                link.click();
                link.remove();
            }
		});
	}
});
```

With our helper functions in place, we can add our first event listener to open the dialog.

```js
const viewer = new ProductViewer(iframe);
viewer.init(viewerID, {
	autostart: true, // autostart the viewer
    render_background: true, // render even when not focused
    annotations: false, // Disable annotations
	onSuccess: function (api) {
		api.on("viewer.start", function () {

            function resetIframe() {
                iframe.style.width = "100%";
                iframe.style.height = "100%";
            }
            resetIframe();

            function waitForFrames(amount) {
                return new Promise((resolve) => {
                    function wait(n) {
                        if(n == 0) resolve();
                        else requestAnimationFrame(() => wait(n - 1));
                    }
                    wait(amount);
                });
            }

            function downloadBase64(data, name) {
                const link = document.createElement("a");
                link.href = data;
                link.download = name;
                link.click();
                link.remove();
            }

            buttonDialog.addEventListener("click", () => {
                dialog.showModal();
            });
		});
	}
});
```

And finally all we need to do is add an event listener to our screenshot button.
Once this is pressed, we want to get the resolution from our input fields (as integer!).
After that we want to resize the iframe, wait for two frames and get our screenshot.

```js
const viewer = new ProductViewer(iframe);
viewer.init(viewerID, {
	autostart: true, // autostart the viewer
    render_background: true, // render even when not focused
    annotations: false, // Disable annotations
	onSuccess: function (api) {
		api.on("viewer.start", function () {

            function resetIframe() {
                iframe.style.width = "100%";
                iframe.style.height = "100%";
            }
            resetIframe();

            function waitForFrames(amount) {
                return new Promise((resolve) => {
                    function wait(n) {
                        if(n == 0) resolve();
                        else requestAnimationFrame(() => wait(n - 1));
                    }
                    wait(amount);
                });
            }

            function downloadBase64(data, name) {
                const link = document.createElement("a");
                link.href = data;
                link.download = name;
                link.click();
                link.remove();
            }

            buttonDialog.addEventListener("click", () => {
                dialog.showModal();
            });

            buttonScreenshot.addEventListener("click", async () => {
                // get resolution
                const width = parseInt(inputWidth.value);
                const height = parseInt(inputHeight.value);

                // resize frame and wait
                iframe.style.width = width + "px";
                iframe.style.height = height + "px";
                await waitForFrames(2);

                // get screenshot, download and reset
                api.getScreenshot([width, height], (data) => {
                    downloadBase64(data, "Screenshot");
                    resetIframe();
                    dialog.close();
                });
            });
		});
	}
});
```

With everything setup, we should now have simple tool for taking screenshots.
Your script should now look somewhat like [this](./script.js).
Feel free to add your own style and logic to it.
