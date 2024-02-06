const CUSTOM_COMMANDS = {
  hello: {
    msg: "Hello :)",
  },
  buy: {
    msg: "Buy :)",
  },
};

let commandHistory = [];
let historyIndex = -1;
let hintIndex = -1;

document.getElementById("input").addEventListener("keydown", function (event) {
  const inputElement = document.getElementById("input");

  if (event.key === "Enter") {
    handleEnterKey();
  } else if (event.key === "ArrowUp") {
    navigateCommandHistory(1);
    navigateCommandHints(-1);
  } else if (event.key === "ArrowDown") {
    navigateCommandHistory(-1);
    navigateCommandHints(1);
  } else if (event.key === "Tab") {
    event.preventDefault();
    completeCommand();
  }
});

document.getElementById("input").addEventListener("input", function (event) {
  const inputElement = event.target;
  const userInput = inputElement.value.trim();

  if (userInput !== "") {
    updateCommandHints(userInput);
  } else {
    hideCommandHints();
  }
});

document
  .getElementById("command-hints")
  .addEventListener("click", function (event) {
    if (event.target.tagName === "SPAN") {
      document.getElementById("input").value = event.target.textContent;
      hideCommandHints();
      handleEnterKey();
    }
  });

function handleEnterKey() {
  handleInput();
}

function handleInput() {
  const inputElement = document.getElementById("input");
  const userInput = inputElement.value.trim();

  if (userInput === "") {
    return;
  }

  commandHistory.unshift(userInput);
  historyIndex = -1;

  inputElement.value = "";

  const outputElement = document.getElementById("output");

  if (userInput.startsWith("hint")) {
    completeCommand();
  } else {
    handleCommand(userInput);
  }

  const newOutputDiv = createCommandResultElement("<br>");
  outputElement.appendChild(newOutputDiv);

  hideCommandHints();
}

function handleCommand(userInput) {
  switch (userInput.toLowerCase()) {
    case "clear":
      clearTerminal();
      break;
    case "help":
      printHelp();
      break;
    case "quote":
      fetchQuote();
      break;
    default:
      if (userInput.toLowerCase().startsWith("double ")) {
        printDoubleX(userInput.substring(7));
      } else {
        handleCustomCommand(userInput);
      }
  }
}

function clearTerminal() {
  const outputElement = document.getElementById("output");

  const lastLoginDiv = createCommandResultElement(
    `Last Login: ${getCurrentDateTime()}`
  );
  outputElement.innerHTML = "";
  outputElement.appendChild(lastLoginDiv);
}

function printHelp() {
  const outputElement = document.getElementById("output");
  outputElement.innerHTML += "Available Commands:<br>";
  outputElement.innerHTML += "- clear: Clear the terminal<br>";
  outputElement.innerHTML += "- help: Display available commands<br>";
  outputElement.innerHTML += "- quote: Display a random quote<br>";
  outputElement.innerHTML += "- double X: Multiply X by 2<br>";
  outputElement.innerHTML += "- hello: Display a greeting<br>";

  for (const command in CUSTOM_COMMANDS) {
    outputElement.innerHTML += `- ${command}: ${CUSTOM_COMMANDS[command].msg}<br>`;
  }
}

async function fetchQuote() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();

    if (data && data.quote && data.author) {
      const outputElement = document.getElementById("output");
      outputElement.innerHTML += `Random Quote: "${data.quote}" - ${data.author}<br>`;
      outputElement.innerHTML += "<br>";
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
}

function printDoubleX(input) {
  const outputElement = document.getElementById("output");
  const inputValue = input.trim();

  if (!isNaN(parseFloat(inputValue))) {
    const result = parseFloat(inputValue) * 2;
    const userLineDiv = createCommandResultElement(
      `User: double ${inputValue}`
    );
    outputElement.appendChild(userLineDiv);
    const terminalLineDiv = createCommandResultElement(
      `Terminal: Double of ${inputValue}: ${result}`
    );
    outputElement.appendChild(terminalLineDiv);
    document.getElementById("input").value = "";
  } else {
    const errorDiv = createCommandResultElement(
      "Invalid input. Please enter a number."
    );
    outputElement.appendChild(errorDiv);
  }
}

function handleCustomCommand(command) {
  const outputElement = document.getElementById("output");
  const userLineDiv = createCommandResultElement(`User: ${command}`);
  outputElement.appendChild(userLineDiv);
  const terminalResponse = CUSTOM_COMMANDS[command]?.msg || "Command not found";
  const terminalLineDiv = createCommandResultElement(
    `Terminal: ${terminalResponse}`
  );
  outputElement.appendChild(terminalLineDiv);
}

function createCommandResultElement(text) {
  const commandResultDiv = document.createElement("div");
  commandResultDiv.className = "command-result";
  commandResultDiv.innerHTML = text;
  return commandResultDiv;
}

function navigateCommandHistory(direction) {
  const inputElement = document.getElementById("input");

  if (commandHistory.length > 0) {
    historyIndex += direction;

    if (historyIndex < 0) {
      historyIndex = -1;
      inputElement.value = "";
    } else if (historyIndex >= commandHistory.length) {
      historyIndex = commandHistory.length - 1;
    } else {
      inputElement.value = commandHistory[historyIndex];
    }
  }
}

function updateCommandHints(userInput) {
  const inputElement = document.getElementById("input");
  const commandHintsElement = document.getElementById("command-hints");

  const allCommands = Object.keys(CUSTOM_COMMANDS).concat([
    "clear",
    "help",
    "quote",
    "double",
  ]);
  const matchingCommands = allCommands.filter((command) =>
    command.startsWith(userInput)
  );

  commandHintsElement.innerHTML = matchingCommands
    .map((command) => `<span>${command}</span>`)
    .join("");

  if (matchingCommands.length > 0) {
    showCommandHints();
    hintIndex = -1;
  } else {
    hideCommandHints();
    hintIndex = -1;
  }
}

function hideCommandHints() {
  const commandHintsElement = document.getElementById("command-hints");
  commandHintsElement.innerHTML = "";
  commandHintsElement.style.display = "none";
}

function showCommandHints() {
  const commandHintsElement = document.getElementById("command-hints");
  commandHintsElement.style.display = "block";
}

function completeCommand() {
  const inputElement = document.getElementById("input");
  const commandHintsElement = document.getElementById("command-hints");

  if (commandHintsElement.children.length > 0) {
    const completedCommand = commandHintsElement.children[0].textContent;
    inputElement.value = completedCommand;
    hideCommandHints();
    handleEnterKey();
  }
}

function navigateCommandHints(direction) {
  const commandHintsElement = document.getElementById("command-hints");
  const hintElements = commandHintsElement.children;

  if (hintElements.length > 0) {
    hintIndex += direction;

    if (hintIndex < 0) {
      hintIndex = hintElements.length - 1;
    } else if (hintIndex >= hintElements.length) {
      hintIndex = 0;
    }

    for (let i = 0; i < hintElements.length; i++) {
      hintElements[i].classList.toggle("selected", i === hintIndex);
    }
  }
}

function setInitialContent() {
  const outputElement = document.getElementById("output");

  const lastLoginDiv = createCommandResultElement(
    `Last Login: ${getCurrentDateTime()}`
  );
  outputElement.appendChild(lastLoginDiv);
}

function getCurrentDateTime() {
  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  return currentDate.toLocaleDateString("en-US", options);
}

setInitialContent();
