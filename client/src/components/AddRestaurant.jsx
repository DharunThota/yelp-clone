import React, {useContext, useState} from "react";
import RestaurantFinder from "../apis/RestaurantFinder";
import { RestaurantsContext } from "../context/RestaurantsContext";

function AddRestaurant() {
    const {addRestaurant} = useContext(RestaurantsContext)
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [priceRange, setPriceRange] = useState("Price Range");

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await RestaurantFinder.post("/", {
                name,
                location,
                price_range: priceRange,
            });
            addRestaurant(response.data.data.restaurants);
            setName("");
            setLocation("");
            setPriceRange("Price Range");
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return( 
        <div className="mb-4">
            <form action="" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col">
                        <input value={name} onChange={event => setName(event.target.value)} type="text" className="form-control" placeholder="Name"/>
                    </div>
                    <div className="col">
                        <input value={location} onChange={event => setLocation(event.target.value)} type="text" className="form-control" placeholder="Location"/>
                    </div>
                    <div className="col">
                        <select value={priceRange} onChange={event => setPriceRange(event.target.value)} className="form-select my-1 mr-sm-2">
                            <option disabled>Price Range</option>
                            <option value='1'>$</option>
                            <option value='2'>$$</option>
                            <option value='3'>$$$</option>
                            <option value='4'>$$$$</option>
                            <option value='5'>$$$$$</option>
                        </select>
                    </div>
                    <div className="col-1">
                        <button type="submit" className="btn btn-primary">Add</button>
                    </div>
                </div> 
            </form>
            
        </div>
    );
}

export default AddRestaurant;