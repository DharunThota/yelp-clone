import React, { useState } from "react";
import RestaurantFinder from "../apis/RestaurantFinder";
import { useParams } from "react-router-dom";

function AddReview(){
    const {id} = useParams();
    const [name, setName] = useState("");
    const [rating, setRating] = useState("Rating");
    const [review, setReview] = useState("");

    async function handleSubmit(event){
        event.preventDefault();
        try {
            const response = await RestaurantFinder.post(`/${id}/addReview`, {
                name,
                rating,
                review,
            });
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="mb-2">
            <form action="" onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="form-group col-8">
                        <label htmlFor="name">Name</label>
                        <input value={name} onChange={(event) => setName(event.target.value)} id="name" placeholder="Name" type="text" className="form-control" />
                    </div>
                    <div className="form-group col-4">
                        <label htmlFor="Rating">Rating</label>
                        <select value={rating} onChange={(event) => setRating(event.target.value)} id="rating" className="form-select">
                            <option disabled>Rating</option>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                            <option value='5'>5</option>
                        </select>
                    </div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="review">Review</label>
                    <textarea value={review} onChange={(event) => setReview(event.target.value)} id="review" className="form-control "></textarea>
                </div>
                <button className="btn btn-primary" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddReview;