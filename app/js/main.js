import '../css/main.scss'

import PhotoEditor from './editor-canvas'

const AppView = () => {
    document.body.innerHTML = `<h1>Simple Example</h1>
        <form action="#">
            <fieldset>
                <label for="fileSelector">Select an Image file</label>
                <input type="file" id="fileSelector" accept=".jpeg,.jpg,.png,.gif"/>
            </fieldset>
            <fieldset>
                <label for="submitBtn">Save current project</label>
                <button id="submitBtn" disabled>Submit</div>
            </fieldset>
            <fieldset>
                <label for="importBtn">Load saved project</label>
                <button id="importBtn">Import</div>
                <input type="file" id="importSelector" accept=".json" hidden />
            </fieldset>
        </form>

        <canvas id="editor-canvas"></canvas>
        
        <div class="editor-controls">
            <button id="upBtn">UP</button>
            <button id="downBtn">DOWN</button>
            <button id="leftBtn">LEFT</button>
            <button id="rightBtn">RIGHT</button>
            <div class="editor-controls-zoom">
                <button id="zoomInBtn">+</button>
                <button id="zoomOutBtn">-</button>
            </div>
        </div>
    `;

    const photoEditor = new PhotoEditor('#editor-canvas');

    let currentFileName = '';

    // grab DOM elements inside index.html
    const fileSelector = document.getElementById("fileSelector");

    fileSelector.onchange = function (e) {
        // get all selected Files
        const files = e.target.files;
        let file;
        for (let i = 0; i < files.length; ++i) {
            file = files[i];
            // check if file is valid Image (just a MIME check)
            switch (file.type) {
                case "image/jpeg":
                case "image/png":
                case "image/gif":
                    currentFileName = file.name;
                    // read Image contents from file
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        // create HTMLImageElement holding image data
                        const img = new Image();
                        img.src = reader.result;

                        img.onload = function () {
                            photoEditor.loadImage(img);
                            document.getElementById('submitBtn').disabled = false;
                        }
                    };
                    reader.readAsDataURL(file);
                    // process just one file.
                    return;
            }
        }
    };

    document.getElementById('submitBtn').addEventListener('click', () => {
        const json = JSON.stringify(photoEditor.getState());
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentFileName}.json`;
        a.textContent = "Download json description";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    document.getElementById('importBtn').addEventListener('click', () => {
        const importSelector = document.getElementById('importSelector')

        importSelector.click();

        importSelector.onchange = function (e) {
            // get all selected Files
            const files = e.target.files;
            let file;
            for (let i = 0; i < files.length; ++i) {
                file = files[i];

                // check if file is valid Image (just a MIME check)
                switch (file.type) {
                    case "application/json":
                        // read contents from file
                        const reader = new FileReader();
                        reader.onload = function () {
                            const photoEditorState = JSON.parse(reader.result);
                            photoEditor.loadState(photoEditorState);
                        };
                        reader.readAsText(file);
                        // process just one file.
                        return;
                }
            }
        };
    });

    // --- BUTTONS ---

    const leftBtn = document.getElementById("leftBtn");
    leftBtn.addEventListener('click', () => {
        const delta = 10;
        photoEditor.translateImage(delta, 0)
    });

    const rightBtn = document.getElementById("rightBtn");
    rightBtn.addEventListener('click', () => {
        const delta = -10;
        photoEditor.translateImage(delta, 0)
    });

    const upBtn = document.getElementById("upBtn");
    upBtn.addEventListener('click', () => {
        const delta = 10;
        photoEditor.translateImage(0, delta);
    });

    const downBtn = document.getElementById("downBtn");
    downBtn.addEventListener('click', () => {
        const delta = -10;
        photoEditor.translateImage(0, delta);
    });

    // ---

    const zoomInBtn = document.getElementById("zoomInBtn");
    zoomInBtn.addEventListener('click', () => {
        const deltaScale = 0.1;
        photoEditor.scaleImage(deltaScale);
    });

    const zoomOutBtn = document.getElementById("zoomOutBtn");
    zoomOutBtn.addEventListener('click', () => {
        const deltaScale = -0.1;
        photoEditor.scaleImage(deltaScale);
    });

}

AppView();

