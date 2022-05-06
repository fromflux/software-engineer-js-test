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
        <button id="submitBtn">Submit</div>
        <button id="loadBtn" disabled>Load</div>
    `;

    const photoEditor = new PhotoEditor('#editor');
    let photoEditorState = null;

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
                    // read Image contents from file
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        // create HTMLImageElement holding image data
                        const img = new Image();
                        img.src = reader.result;

                        img.onload = function () {
                            photoEditor.loadImage(img);
                        }
                    };
                    reader.readAsDataURL(file);
                    // process just one file.
                    return;

            }
        }
    };

    document.getElementById('submitBtn').addEventListener('click', () => {
        photoEditorState = photoEditor.getState();
        console.log(JSON.stringify(window.photoEditorState, null, 2));
        document.getElementById('loadBtn').disabled = false;
    });

    document.getElementById('loadBtn').addEventListener('click', () => {
        photoEditor.loadState(photoEditorState);
    });
}

AppView();

