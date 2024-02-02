let data = [];
let specificData = [];
let bundeslaender_names = [];
let FilteredLetters = [];

async function init() {
    await fetchJSON();
    renderAllBundeslaender();
    getFilteredLetters();
    renderLetters();
}

async function fetchJSON() {
    try {
        let resp = await fetch('bundesland.json');
        data = await resp.json();
        console.log('Fetch was successfull!')
        console.log(data);
    } catch (err) {
        console.log('Fetch was not successfull!');
    }
}

function renderAllBundeslaender() {
    document.getElementById('bundeslaender_wrapper').innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const bundesland = data[i];
        let name = bundesland['name'];
        bundeslaender_names.push(name);
        let population = bundesland['population'];
        let url = bundesland['url'];
        document.getElementById('bundeslaender_wrapper').innerHTML += renderHTML(name, population, url);
    }
}

function renderHTML(name, population, url) {
    return /*html*/`
        <a href="${url}" target="_blank" class="bundesland">
            <div class="bundesland_name">${name}</div>
            <div class="bundesland_population">${population} Millionen</div>
        </a>
    `
}

function renderLetters() {
    for (let i = 0; i < FilteredLetters.length; i++) {
        const letter = FilteredLetters[i];
        document.getElementById('letters').innerHTML += renderLettersHTML(letter, i);
    }
    document.getElementById('letters').innerHTML += /*html*/`
        <div onclick="showAllElement()" class="letter" id="letter_all}">#</div>
    `
}

function renderLettersHTML(letter, i) {
    return /*html*/`
        <div onclick="showFilteredBundeslaender(${i})" class="letter" id="letter_${i}">${letter}</div>
    `
}

function getFilteredLetters() {
    for (let i = 0; i < bundeslaender_names.length; i++) {
        const bundesland_name = bundeslaender_names[i];
        let letter = bundesland_name.charAt(0);
        if (!FilteredLetters.includes(letter)) {
            FilteredLetters.push(letter);
        }
    }
}

function showFilteredBundeslaender(letterIndex) {
    const selectedLetter = FilteredLetters[letterIndex];
    const filteredBundeslaender = bundeslaender_names.filter(bundesland => bundesland.charAt(0) === selectedLetter);

    // show only filtered Bundesländer
    showFilteredElement();
    renderFilteredBundeslaender(filteredBundeslaender);
}

function renderFilteredBundeslaender(filteredBundeslaender) {
    const specificBundeslaenderWrapper = document.getElementById('specific_bundeslaender_wrapper');
    specificBundeslaenderWrapper.innerHTML = '';

    for (let i = 0; i < filteredBundeslaender.length; i++) {
        const bundeslandName = filteredBundeslaender[i];
        const bundesland = data.find(entry => entry.name === bundeslandName);
        const population = bundesland.population;
        const url = bundesland.url;

        specificBundeslaenderWrapper.innerHTML += renderHTML(bundeslandName, population, url);
    }
}

function showFilteredElement() {
    document.getElementById('bundeslaender_wrapper').classList.add('d_none');
    document.getElementById('specific_bundeslaender_wrapper').classList.remove('d_none');
}

function showAllElement() {
    document.getElementById('bundeslaender_wrapper').classList.remove('d_none');
    document.getElementById('specific_bundeslaender_wrapper').classList.add('d_none');
    renderAllBundeslaender();
}