import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantFinder from "../apis/RestaurantFinder";

function UpdateRestaurant(props){
    const {id} = useParams();
    let navigate = useNavigate();
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [priceRange, setPriceRange] = useState("");
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await RestaurantFinder.get(`/${id}`);
                const restaurant = response.data.data.restaurants;
                setName(restaurant.name);
                setLocation(restaurant.location);
                setPriceRange(restaurant.price_range);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await RestaurantFinder.put(`/${id}`, {
                name,
                location,
                price_range: priceRange,
            });
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input value={name} onChange={(event) => setName(event.target.value)} type="text" className="form-control" id="name" />
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input value={location} onChange={(event) => setLocation(event.target.value)} type="text" className="form-control" id="location" />
                </div>
                <div className="mb-3">
                    <label htmlFor="price_range" className="form-label">Price Range</label>
                    <input value={priceRange} onChange={(event) => setPriceRange(event.target.value)} type="number" className="form-control" id="price_range" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
      );
}

export default UpdateRestaurant;