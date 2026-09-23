# Orbit Calculator

Orbit Calculator is a responsive calculator with a compact instrument-panel interface, built with vanilla HTML, CSS, and JavaScript.

## Features

- Addition, subtraction, multiplication, division, percentages, decimals, and sign toggling
- Keyboard input for digits and operators
- Calculation history with clickable previous results
- Memory controls: `MC`, `MR`, `M+`, and `M−`
- Copy-result button with visual feedback
- Responsive layout for desktop and mobile screens
- No build step or external JavaScript dependencies

## Run Locally

Open `index.html` directly in a browser. No installation or build step is required.

For an optional local server, use any static server you already have installed. For example, with Node.js and `npx`:

```sh
npx serve .
```

Then open the local URL shown in the terminal.

## Keyboard Controls

| Key                | Action                                    |
| ------------------ | ----------------------------------------- |
| `0`–`9`            | Enter a number                            |
| `+`, `-`, `*`, `/` | Choose an operator                        |
| `Enter` or `=`     | Calculate                                 |
| `.`                | Add a decimal point                       |
| `%`                | Convert the current value to a percentage |
| `Escape` or `C`    | Clear the calculator                      |
| `Command + K`      | Focus the calculator                      |

## Project Structure

```text
calculator/
├── index.html   # Calculator markup
├── styles.css   # Layout, responsive styles, and visual theme
├── script.js    # Calculator logic and interaction handling
└── README.md    # Project documentation
```
