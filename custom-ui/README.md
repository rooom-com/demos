# Customizing the UI

> [!NOTE]
The following guide can also be applied to the space viewer.

In case your company has its own unique branding, it is most likely that you want to customize the look of your product viewer.
There are two ways to customize the look of your viewer.
One option is to utilize the offered theming options for the viewer.
If that is not enough you can also replace the ui completely with your own elements utilizing the viewer api.

## Theming

[Show example](https://rooom-com.github.io/demos/custom-ui/theming/)

[Playground](https://play.rooom.io)

The easiest way to customize the look of the viewer is theming.
In the initialization options of the viewer (or its url options) you can specify which elements to show or hide as well as colors and logos to use.
All available options can be found [here](https://developers.rooom.com/docs/rooom-products/viewer/customization.html#user-interface).

### Colors

Let's start by customizing some colors.
There are several color options available under the ui initialization options.
To match the style of our shown object, we customize the primary, secondary and accent color of the viewer ui.

```js
viewer.init("e725a9e18cb87bbc2977b73d4bdc65", {
	ui_color_primary: "1d2130",
	ui_color_secondary: "ffffff",
	ui_color_accent: "ffffff",
});
```

Unfortunately the loading screen still uses the rooom color scheme.
To make the loading screen fit our ui theme, we need to adjust its color and background color.
Note that for the background color we provide an 8-Character long hex code that also holds alpha/opacity values at the last two characters.

```js
viewer.init("e725a9e18cb87bbc2977b73d4bdc65", {
	ui_color_primary: "1d2130",
	ui_color_secondary: "ffffff",
	ui_color_accent: "ffffff",
	ui_progress_color: "ffffff",
	ui_progress_bg_color: "000000AA",
});
```

### Logos

The Last thing we need to adjust are the logos at the top and bottom of our viewer, as well as the one on the loading screen.
In this example we are going to remove the top info bar completely, as well as the bottom logo.
To replace the logo on the loading screen, we are going to use a placeholder image.

```js
viewer.init("e725a9e18cb87bbc2977b73d4bdc65", {
	ui_color_primary: "1d2130",
	ui_color_secondary: "ffffff",
	ui_color_accent: "ffffff",
	ui_progress_color: "ffffff",
	ui_progress_bg_color: "000000AA",
	ui_infos: false,
	ui_logo: false,
	ui_progress_logo: "https://place-hold.it/100x100",
});
```

And that's it so far for theming the product viewer!
If you want, you can try it yourself on the [Playground](https://play.rooom.io) right now.

## Replacing

[Show example](https://rooom-com.github.io/demos/custom-ui/replacing/)

[Playground](https://play.rooom.io)

If coloring is not enough for your use case, or you want to create some unique ui elements, it is possible to disable the ui completely.
Using the api, you can then create your own overlay with custom functionality.

### Disabling the UI

Using the initialization options, it is possible to disable some or all ui elements.
Disabling the ui completely can be achieved by specifying the following initialization options:

```js
viewer.init("e725a9e18cb87bbc2977b73d4bdc65", {
	ui_controls: false, // disable control elements
	ui_annotations: false, // disable annotation controls
	ui_animations: false, // disable animation controls
	ui_infos: false, // remove top info bar
	ui_logo: false, // remove logo in bottom left corner
});
```

### Adding a custom element

With the UI disabled we can now define our own elements.
In this example we are just adding one button to reset the camera of our viewer.
This button should show only when the viewer is running.

```html
<bod>
    <iframe id="iframe"></iframe>
    <button id="reset">Reset</button>
</body>
```

We want our button to be at the bottom right just where the control elements would have been if they weren't disabled.
To achieve this, we use some CSS absolute positioning.
We also hide the button on default.

```css
html,
body,
iframe {
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
	border: none;
	overflow: hidden;
}

body {
	position: relative;
}

#reset {
	position: absolute;
	bottom: 16px;
	right: 16px;
	display: none;
}
```

### Connecting with logic.

The last thing we need to do, is apply some logic to our button so it can control the viewer.
To do so, we simply bind a callback to our button which utilizes the api to recenter the camera.

```js
viewer.init("e725a9e18cb87bbc2977b73d4bdc65", {
	ui_controls: false, // disable control elements
	ui_annotations: false, // disable annotation controls
	ui_animations: false, // disable animation controls
	ui_infos: false, // remove top info bar
	ui_logo: false, // remove logo in bottom left corner
	onSuccess: function (api) {
		const button = document.getElementById("reset");
		button.addEventListener("click", function () {
			api.recenterCamera();
		});
	},
});
```

Since we want our button to show only when the viewer is running, we need to configure this logic too.
To do so, we listen for the start event of the viewer and show our button once its fired.

```js
viewer.init("e725a9e18cb87bbc2977b73d4bdc65", {
	ui_controls: false, // disable control elements
	ui_annotations: false, // disable annotation controls
	ui_animations: false, // disable animation controls
	ui_infos: false, // remove top info bar
	ui_logo: false, // remove logo in bottom left corner
	onSuccess: function (api) {
		const button = document.getElementById("reset");
		button.addEventListener("click", function () {
			api.recenterCamera();
		});

		api.on("viewer.start", function () {
			button.style.display = "block";
		});
	},
});
```

And that's it. We now have a custom button to recenter the camera every time we click on it.
Feel free to give this button further styling.
If you want, you can try it yourself on the [Playground](https://play.rooom.io) right now.
