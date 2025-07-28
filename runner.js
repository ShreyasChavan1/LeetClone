const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const imagemap = {
  python: { image: "python-sandbox", ext: "py" },
  cpp: { image: "sandbox-cpp", ext: "cpp" },
  java: { image: "sandbox-java", ext: "java" },
  js: { image: "sandbox-js", ext: "js" }
};

const runPythonCode = async (code, language) => {
  const config = imagemap[language];
  if (!config) return { error: "unsupported language" };

  const filename = `sandbox-${Date.now()}.${config.ext}`;
    const filepath = path.join(__dirname, filename).replace(/\\/g, "/");
    fs.writeFileSync(filepath, code);
  
    const containerPath = `/app/script.${config.ext}`;
    const command = `docker run --rm -v "${filepath}:${containerPath}" ${config.image}`;
    console.log("Running:", command);
  
    return new Promise((resolve) => {
      exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
        fs.unlinkSync(filepath); 
        if (err) {
          resolve({ error: stderr || err.message });
        } else {
          resolve({ output: stdout });
          console.log(stdout);
        }
      });
    });
};

module.exports = runPythonCode;