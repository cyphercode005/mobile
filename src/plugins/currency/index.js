import countries from './countries.json'
import currencies from './currencies.json'

function getCurrencyCode(iso2CountryCode){
    const country = countries[iso2CountryCode]
    const currencyCode = currencies[country.currency].symbol
    return currencyCode
}

export default getCurrencyCode