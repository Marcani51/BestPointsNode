import { ExpressError } from "./ExpressError";

const baseUrl = 'https://geocode.search.hereapi.com/v1'
const apiKey = 'C7RiO-EnbPFrRQZ5YG_vIpSlW8lqbj7dryetmZ1JmlI'

export const geocode=async(address:any)=>{
    const url= `${baseUrl}/geocode?q=${address}&apiKey=${apiKey}`
    try{
        const response = await fetch(url);
        const data = await response.json();
        const lat = data.items[0].position.lat;
        const lng = data.items[0].position.lng;
        return { lat, lng }
    }catch(err:any){
        new ExpressError(err.message,500)
    }
}

export const geometry=async (address:any) => {
    try {
        const position = await geocode(address);
        return {
            type: 'Point',
            coordinates: [position?.lat, position?.lng]
        }
    } catch (err:any) {
        new ExpressError(err.message, 500)
    }
}