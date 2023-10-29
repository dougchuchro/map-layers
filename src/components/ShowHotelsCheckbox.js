// import React from "react";

const ShowHotelsCheckbox = ({ showHotels, onClick }) => {
    return (
        <>
            <div>
                SHOWHOTELS
            </div>
            <label className="switch">
                <input type="checkbox" checked={showHotels} onChange={onClick}></input>
                Show Hotels?
            </label>
            <p>Is "Show Hotels?" checked? {showHotels.toString()}</p>
        </>
    );
}

export default ShowHotelsCheckbox;
