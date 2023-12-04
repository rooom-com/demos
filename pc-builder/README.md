# PC Builder

[Show Demo](https://rooom-com.github.io/demos/pc-builder/)

> [!NOTE]
> This Demo mostly utilizes the `show` and `hide` methods of the ProductViewerAPI.
> You can read more about it [here](https://developers.rooom.com/docs/rooom-products/viewer/viewer-api/objects.html#show).

## Goal

We want to create a little quiz based around building a computer.
In an empty shell, some components will be highlighted.
The user should guess which part it is.
If he is correct, the part will be added.
The game should also keep track of the users progress.

## Implementation

### Base Structure

First at all we will create our base structure.
In here the first thing we do is import the product-viewer script from rooom.
We also import our stylesheet and javascript which we will define further on.

```html{5,6,9}
<!-- index.html -->
<html>
	<head>
		<title>Computer Quiz</title>
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
We don't need specify an `src` since the frame will be controlled by our script.
To use all features of the product viewer, the iFrame will also need some allowance as shown below.

```html
<body>
	<iframe
		id="iframe"
		src=""
		allow="autoplay; fullscreen; vr; xr"
		allowvr
		allowfullscreen
		mozallowfullscreen="true"
		webkitallowfullscreen="true"
	></iframe>
</body>
```

### Layout

For the quiz we need eight buttons for our components as well as a progress bar to show the users progression.
In this example we quickly define them in our html. Feel free to style them as you like.

```html
<!-- Answer Buttons -->
<div class="answers">
	<button id="btnPSU">Power Supply Unit</button>
	<button id="btnRAM">RAM</button>
	<button id="btnMainboard">Mainboard</button>
	<button id="btnDiskDrive">Disk Drive</button>
	<button id="btnHardDrive">Hard Drive</button>
	<button id="btnGPU">GPU</button>
	<button id="btnVentilation">Ventilation</button>
</div>

<!-- Progress Bar -->
<progress id="progress" max="6" value="0"></progress>
```

---

### Mapping

Before we start implementing our business logic, we create some variables and structures to work with.
First at all we specify the id of our targeted product viewer and iframe.

```js
const viewerID = "2d3f3b8c0ec144317151513f0e6aab";
const iframe = document.getElementById("iframe");
const progress = document.getElementById("progress");
```

After that we create maps with the ids for our objects and placeholder.

```js
// Objects
const PSU = {
	objectID: "Power_Supply",
	placeholderID: "Power_Supply_placeholder",
};
const RAM = {
	objectID: "RAM",
	placeholderID: "RAM_placeholder",
};
const Mainboard = {
	objectID: "Motherboard",
	placeholderID: "Motherboard_placeholder",
};
const DiskDrive = {
	objectID: "Disk_Drive",
	placeholderID: "Disk_Drive_placeholder",
};
const HardDrive = {
	objectID: "Hard_Drives",
	placeholderID: "Hard_Drives_placeholder",
};
const GPU = {
	objectID: "Graficscard",
	placeholderID: "Graficscard_placeholder",
};
const Ventilation = {
	objectID: "Vents",
	placeholderID: "Vents_placeholder",
};
```

Finally we map all of our buttons so we can access them easily.

```js
// Buttons
const buttonPSU = document.getElementById("btnPSU");
const buttonRAM = document.getElementById("btnRAM");
const buttonMainboard = document.getElementById("btnMainboard");
const buttonDiskDrive = document.getElementById("btnDiskDrive");
const buttonHardDrive = document.getElementById("btnHardDrive");
const buttonGPU = document.getElementById("btnGPU");
const buttonVentilation = document.getElementById("btnVentilation");
```

### Initialization

After we have our base setup, we can now start by initializing our product viewer with the api.
To tweak our viewer, we pass in some options to the init function.
Note that all of our logic should now go inside the viewers `onSuccess` function.

```js{10}
const viewer = new ProductViewer(iframe);
viewer.init(viewerID, {
	autostart: true, // autostart the viewer
    ui_controls: false, // remove control elements
    render_background: true, // render even when not focused
	transparent: true, // make the viewer environment transparent
    ui_hint: false, // disable startup hint
    camera_zoom_start: 4, // zoom in
	onSuccess: function (api) {
		// logic goes here //
	}
});
```

> [!NOTE]
A detailed list of all initialization options can be found [here](https://developers.rooom.com/docs/rooom-products/viewer/customization.html).

Since we want to interact with our viewer once it is loaded, we also need to start our logic after the viewer has started rendering.

```js{10-12}
const viewer = new ProductViewer(iframe);
viewer.init(viewerID, {
	autostart: true, // autostart the viewer
    ui_controls: false, // remove control elements
    render_background: true, // render even when not focused
	transparent: true, // make the viewer environment transparent
    ui_hint: false, // disable startup hint
    camera_zoom_start: 4, // zoom in
	onSuccess: function (api) {
		api.on("viewer.start", function () {
			// logic goes here //
		});
	}
});
```

### Game Logic

The first thing we want to do is shuffle a list of our objects to create a random order of questions.
Since we will also need the current index in this list for our game, we define it here.

```js
let currentIndex = 0;
const objectList = [
	PSU,
	RAM,
	Mainboard,
	DiskDrive,
	HardDrive,
	GPU,
	Ventilation,
].sort(() => 0.5 - Math.random());
```

At the start of the game, we only want to show the first placeholder and hide everything else.
To get a better view inside, we also want to hide the Side Glass.

```js
api.hide("Side_glass");
objectList.forEach((element, index) => {
	api.hide(element.objectID);
	if (index > 0) api.hide(element.placeholderID);
	else api.show(element.placeholderID);
});
```

With that in place, all we need to do is implement a function to validate our button presses with.

```js
function onButtonPress(answer) {
	if (answer != objectList[currentIndex]) {
		// negative feedback logic //
		return;
	}

	// show object
	api.hide(answer.placeholderID);
	api.show(answer.objectID);

	if (currentIndex == objectList.length - 1) {
		// game ended logic //
		return;
	}

	// show next placeholder
	currentIndex += 1;
	progress.value = currentIndex;
	api.show(objectList[currentIndex].placeholderID);
}
```

This function can now be bound to each button click.

```js
buttonPSU.addEventListener("click", () => onButtonPress(PSU));
buttonRAM.addEventListener("click", () => onButtonPress(RAM));
buttonMainboard.addEventListener("click", () => onButtonPress(Mainboard));
buttonDiskDrive.addEventListener("click", () => onButtonPress(DiskDrive));
buttonHardDrive.addEventListener("click", () => onButtonPress(HardDrive));
buttonGPU.addEventListener("click", () => onButtonPress(GPU));
buttonVentilation.addEventListener("click", () => onButtonPress(Ventilation));
```

With everything setup, your minimal game should now work.
Your script should now look somewhat like [this](./script.js).
Feel free to add your own style and logic to it.
