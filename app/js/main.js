import '../css/main.scss'

import PhotoEditor from './photo-editor'

const AppView = () => {
    document.body.innerHTML = `<h1>Simple Example</h1>
        <form action="#">
            <fieldset>
                <label for="fileSelector">Select an Image file</label>
                <input type="file" id="fileSelector" />
            </fieldset>
        </form>
        <div id="editor"></div>
        <button id="submitBtn" disabled>Submit</div>
        <button id="importBtn">Import</div>
        <input type="file" id="importSelector" hidden />
    `;

    const photoEditor = new PhotoEditor('#editor');

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

}

AppView();

