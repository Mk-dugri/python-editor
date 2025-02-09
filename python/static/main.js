//  for theme like vs code

require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.1/min/vs' } });

require(['vs/editor/editor.main'], function () {
  const editor = monaco.editor.create(document.getElementById('editor'), {
    value: 'print("Hello, world!")',
    language: 'python',
    theme: 'vs-dark',
    fontFamily: "'Fira Code', monospace",
    fontSize: 14,
    lineHeight: 22,
    fontLigatures: true
  });

  document.getElementById('runButton').onclick = function () {
    const code = editor.getValue();
    runCode(code);
  };

  function runCode(code) {
    fetch('/run-python', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    })
      .then(response => response.json())
      .then(data => {
        // document.getElementById('output').textContent = data.output;

        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = data.output;  // Insert the HTML content (with <br> tags)


      })
      .catch(error => {
        document.getElementById('output').textContent = `Error: ${error}`;
      });
  }



  // trying
  document.getElementById('saveButton').onclick = function () {
    const code = editor.getValue();
    saveFile(code);
  }

  function openFile(inputElement) {
    const file = inputElement.files[0];  // Get the selected file

    if (file) {
      const reader = new FileReader();

      // When the file is successfully read, set the content in Monaco editor
      reader.onload = function (e) {
        const fileContent = e.target.result;
        editor.setValue(fileContent);  // Insert the content into the Monaco editor
      };

      reader.readAsText(file);  // Read the file content as text
    }
  }
  function saveFile(code) {
    const textContent = code;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'myfile.py';
    link.click();
  }


  window.openFile = openFile;
});