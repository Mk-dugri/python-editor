from flask import Flask, request, jsonify, send_from_directory,render_template_string,render_template
import subprocess
import sys
import os

app = Flask(__name__)

# Serve the index.html file from the current directory
@app.route('/')
def index():
    # return send_from_directory(os.getcwd(), 'index.html')
    return render_template('index.html')  

@app.route('/run-python', methods=['POST'])
def run_python():
    data = request.get_json()
    code = data['code']

    # Run the Python code inside a subprocess
    try:
        result = subprocess.run(
            [sys.executable, "-c", code],
            capture_output=True,
            text=True,
            timeout=10  # Limit execution time to 10 seconds
        )

        output = result.stdout + result.stderr
        output = output.replace('\n', '<br>')
       
        return jsonify({"output": output})
    
    except Exception as e:
        return jsonify({"output": f"Error: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True)
