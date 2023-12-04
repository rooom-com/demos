const viewerID = "e725a9e18cb87bbc2977b73d4bdc65";
const iframe = document.getElementById("iframe");
const buttonDialog = document.getElementById("dialogButton");
const buttonScreenshot = document.getElementById("screenshotButton");
const inputWidth = document.getElementById("width");
const inputHeight = document.getElementById("height");
const dialog = document.getElementById("dialog");

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
						if (n == 0) resolve();
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
	},
});
