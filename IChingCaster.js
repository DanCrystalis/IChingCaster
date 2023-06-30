function generateHexagram() {
    const elements = [
        "<img src='yang.png' alt='yang'>",
        "<img src='yin.png' alt='yin'>",
        "<img src='changingyang.png' alt='changing yang'>",
        "<img src='changingyin.png' alt='changing yin'>"
    ];

    const hexagram = [];
    for (let i = 0; i < 6; i++) {
        const index = getRandomInt(4);
        hexagram.push(elements[index]);
    }
    return hexagram;
}

function loadHexagramMetadata(callback) {
    const request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open("GET", "hexagrams.json", true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            const metadata = JSON.parse(request.responseText);
            callback(metadata);
        }
    };
    request.send(null);
}

function castHexagram() {
    const hexagramContainer1 = document.getElementById("hexagramContainer");
    const hexagramContainer2 = document.getElementById("hexagramContainer2");

    hexagramContainer1.innerHTML = "";
    hexagramContainer2.innerHTML = "";

    const hexagram1 = generateHexagram();
    hexagramContainer1.appendChild(createHexagramElement("First Hexagram:", hexagram1));

    const hasChangingLine = hexagram1.some(line => line.includes("changing"));
    let hexagram2 = [];
    if (hasChangingLine) {
        hexagram2 = hexagram1.map(line => {
            if (line.includes("changingyang.png")) {
                return "<img src='yin.png' alt='yin'>";
            } else if (line.includes("changingyin.png")) {
                return "<img src='yang.png' alt='yang'>";
            }
            return line;
        });

        hexagramContainer2.appendChild(createHexagramElement("Changing Hexagram:", hexagram2));
    }
    if (hexagramContainer2) {
        if (hasChangingLine) {
            hexagramContainer2.style.display = "grid";
        } else {
            hexagramContainer2.style.display = "none";
        }
    }
    loadHexagramMetadata(function (metadata) {
        const hexagram1Metadata = metadata.hexagrams.find(hex => hex.binary === getBinary(hexagram1));

        hexagramContainer1.appendChild(createMetadataElement("First Hexagram:", hexagram1Metadata));

        if (hasChangingLine) {
            const hexagram2Metadata = metadata.hexagrams.find(hex => hex.binary === getBinary(hexagram2));
            hexagramContainer2.appendChild(createMetadataElement("Changing Hexagram:", hexagram2Metadata));
        }
    });
}




function getBinary(hexagram) {
    return hexagram.map(line => {
        if (line.includes("yang.png")) {
            return "1";
        } else if (line.includes("yin.png")) {
            return "0";
        }
        return "-";
    }).join("");
}

function createHexagramElement(label, hexagram) {
    const element = document.createElement("div");
    const labelElement = document.createElement("p");
    labelElement.textContent = label;
    element.appendChild(labelElement);

    hexagram.forEach(line => {
        const lineElement = document.createElement("div");
        lineElement.innerHTML = line;
        element.appendChild(lineElement);
    });

    const images = element.getElementsByTagName("img");


    for (let i = 0; i < images.length; i++) {
        images[i].style.width = "80%";
        images[i].style.height = "100%";
    }

    return element;
}

function createMetadataElement(label, metadata) {
    const element = document.createElement("div");
    const labelElement = document.createElement("p");
    labelElement.textContent = label;
    element.appendChild(labelElement);

    const metadataContainer = document.createElement("div");
    metadataContainer.classList.add("metadata-details");
    element.appendChild(metadataContainer);

    const numberElement = document.createElement("p");
    numberElement.textContent = "Number: " + metadata.number;
    element.appendChild(numberElement);

    // Convert 'names' to an array if it's not already
    const names = Array.isArray(metadata.names) ? metadata.names : [metadata.names];
    const namesElement = document.createElement("p");
    namesElement.textContent = "Names: " + names.join(", ");
    element.appendChild(namesElement);

    const chineseNameElement = document.createElement("p");
    chineseNameElement.textContent = "Chinese Name: " + metadata.chineseName;
    element.appendChild(chineseNameElement);

    const pinyinNameElement = document.createElement("p");
    pinyinNameElement.textContent = "Pinyin Name: " + metadata.pinyinName;
    // element.appendChild(pinyinNameElement);

    const characterElement = document.createElement("p");
    characterElement.textContent = "Character: " + metadata.character;
    element.appendChild(characterElement);

    const topTrigramElement = document.createElement("p");
    topTrigramElement.textContent = "Top Trigram: " + metadata.topTrigram;
    element.appendChild(topTrigramElement);

    const bottomTrigramElement = document.createElement("p");
    bottomTrigramElement.textContent = "Bottom Trigram: " + metadata.bottomTrigram;
    element.appendChild(bottomTrigramElement);

    const binaryElement = document.createElement("p");
    binaryElement.textContent = "Binary: " + metadata.binary;
    // element.appendChild(binaryElement);

    const linesElement = document.createElement("p");
    linesElement.textContent = "Lines: " + metadata.lines.join(", ");
    // element.appendChild(linesElement);

    return element;
}


function getRandomInt(max) {
    const cryptoRandomValues = new Uint32Array(1);
    window.crypto.getRandomValues(cryptoRandomValues);
    const cryptoRandomNumber = cryptoRandomValues[0] % max;

    const otherRandomNumber = Math.floor(Math.random() * max);

    // Combine the two random numbers
    const combinedRandomNumber = (cryptoRandomNumber + otherRandomNumber) % max;

    return combinedRandomNumber;
}
