import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RestaurantsContext } from "../context/RestaurantsContext";
import RestaurantFinder from "../apis/RestaurantFinder";
import StarRating from "../components/StarRating";
import Reviews from "../components/Reviews";
import AddReview from "../components/AddReview";

function RestaurantDetailPage() {
    const {id} = useParams();
    const {selectedRestaurant, setSelectedRestaurant} = useContext(RestaurantsContext);

    useEffect(() => {
        async function fetchData(){
            try {
                const response = await RestaurantFinder.get(`/${id}`);
                setSelectedRestaurant(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    return <div>{selectedRestaurant && (
            <>
                <h1 className="font-weight-light display-1 text-center">{selectedRestaurant.restaurants.name}</h1>
                <div className="text-center">
                    <StarRating rating={selectedRestaurant.restaurants.average_rating} />
                    <span className="text-warning ms-1">{selectedRestaurant.restaurants.count ? `(${selectedRestaurant.restaurants.count})` : "(0)"}</span>
                </div>
                <div className="mt-3">
                    <Reviews reviews={selectedRestaurant.reviews}/>
                </div>
                <AddReview />
            </>
    )}</div>;
}

export default RestaurantDetailPage;