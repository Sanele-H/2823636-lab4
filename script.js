async function searchCountry(countryName) {
    const resultContainer = document.getElementById('country-info');
    const bordersContainer = document.getElementById('bordering-countries');
    const errorContainer = document.getElementById('error-message');
    const spinner = document.getElementById("loading-spinner");
    try {
        
        resultContainer.innerHTML = "";
        bordersContainer.innerHTML = "";
        errorContainer.textContent = "";
        
        if (!countryName.trim()){
            throw new Error("Please enter a Country name")
        }
        // Show loading spinner
        spinner.style.display = "block";
        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if(!response.ok){
            throw new Error("Country not Found");
        }
        const data = await response.json();
        const country = data[0];
        // Update DOM
        document.getElementById('country-info').innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital[0]}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.svg}" alt="${country.name.common} flag">`;
        // Fetch bordering countries
        //const resBordering = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        if (country.borders && country.borders.length > 0) {
            const borderPromises = country.borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error("Error fetching border country.");
                        }
                        return res.json();
                    })
            );

            const borderResults = await Promise.all(borderPromises);

            borderResults.forEach(result => {
                const borderCountry = result[0];

                const borderElement = document.createElement("div");
                borderElement.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" 
                         alt="${borderCountry.name.common} flag" 
                         width="100">
                `;

                bordersContainer.appendChild(borderElement);
            });
        } else {
            bordersContainer.innerHTML = "<p>No bordering countries.</p>";
        }
        // Update bordering countries section


    } catch (error) {
        // Show error message
        console.error(error);
        errorContainer.textContent = "Failed to load user: " + error.message;

    } finally {
        // Hide loading spinner
        spinner.style.display = "none";
    }
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    searchCountry(country);
});
document.getElementById('country-input').addEventListener('keydown',(event)=>{
    if(event.key === "Enter"){
    const country = document.getElementById('country-input').value.trim();
    searchCountry(country);
    }
})
