import React, {useContext, useEffect} from "react";
import RestaurantFinder from "../apis/RestaurantFinder";
import { RestaurantsContext } from "../context/RestaurantsContext";
import {useNavigate} from "react-router-dom";
import StarRating from "./StarRating";

function RestaurantList(props) {
    const {restaurants, setRestaurants} = useContext(RestaurantsContext);
    let navigate = useNavigate();
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await RestaurantFinder.get("/");
                setRestaurants(response.data.data.restaurants);
            } catch (error) {
                 console.log(error);
            }
        }
        fetchData();
    }, []);

    async function handleDelete(event, id){
        event.stopPropagation();
        try {
            const response = await RestaurantFinder.delete(`/${id}`);
            setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
        } catch (error) {
            console.log(error);
        }
    }

    function handleUpdate(event, id){
        event.stopPropagation();
        navigate(`/restaurants/${id}/update`);
    }

    function handleRestaurantSelect(id){
        navigate(`/restaurants/${id}`);
    }

    function renderRating(restaurant){
        if(!restaurant.count){
            return <span className="text-warning">0 reviews</span>
        }
        return (
            <>
                <StarRating rating={restaurant.average_rating} />
                <span className="text-warning ms-1">({restaurant.count})</span>
            </>
        );
    }

    return (
        <div className="list-group">
            <table className="table table-hover table-dark">
                <thead>
                    <tr>
                        <th scope="col">Restaurant</th>
                        <th scope="col">Location</th>
                        <th scope="col">Price Range</th>
                        <th scope="col">Ratings</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants && 
                    restaurants.map((restaurant) => {
                        return (
                            <tr onClick={() => handleRestaurantSelect(restaurant.id)} key={restaurant.id}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.location}</td>
                                <td>{"$".repeat(restaurant.price_range)}</td>
                                <td>{renderRating(restaurant)}</td>
                                <td><button onClick={(event) => handleUpdate(event, restaurant.id)} className="btn btn-warning">Update</button></td>
                                <td><button onClick={(event) => handleDelete(event, restaurant.id)} className="btn btn-danger">Delete</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default RestaurantList;