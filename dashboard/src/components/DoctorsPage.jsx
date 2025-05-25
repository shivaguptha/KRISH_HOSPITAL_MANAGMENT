import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const { isAuthenticated, setIsAuthenticated } = useContext(Context);


const DoctorsPage = () => {

    const [doctors, setDoctors] = useState([]);
    const { isAuthenticated } = useContext(Context);
    
    useEffect(() => {
        const fetchDoctors = async () => {
        try {
            const { data } = await axios.get(
            "https://h-hico.onrender.com/api/v1/user/doctors",
            { withCredentials: true }
            );
            setDoctors(data.doctors);
        } catch (error) {
            toast.error(error.response.data.message);
        }
        };
        fetchDoctors();
    }, []);
    
    if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
    }
    
    return (
        <section className="page doctors">
        <h1>DOCTORS</h1>
        <div className="banner">
            {doctors && doctors.length > 0 ? (
            doctors.map((doctor) => (
                <div className="card" key={doctor._id}>
                <img
                    src={doctor.docAvatar && doctor.docAvatar.url}
                    alt="doctor avatar"
                />
                <h3>{doctor.name}</h3>
                <p>{doctor.specialization}</p>
                </div>
            ))
            ) : (
            <p>No doctors available.</p>
            )}
        </div>
        </section>
    );

}

export default DoctorsPage;