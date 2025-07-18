import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

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

  // Delete doctor handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://h-hico.onrender.com/api/v1/user/doctor/delete/${id}`,
        { withCredentials: true }
      );
      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
      toast.success("Doctor deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete doctor.");
    }
  };

  // Update doctor handler
  const handleUpdate = (doctor) => {
    navigate("/doctor/addnew", { state: { doctor } });
  };

  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>
      <div className="banner">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => {
            return (
              <div className="card" key={element._id}>
                <img
                  src={element.docAvatar && element.docAvatar.url}
                  alt="doctor avatar"
                />
                <h4>{`${element.firstName} ${element.lastName}`}</h4>
                <div className="details">
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    DOB: <span>{element.dob.substring(8, 10)+'/'+element.dob.substring(5, 7)+'/'+element.dob.substring(0, 4)}</span>
                  </p>
                  <p>
                    Department: <span>{element.doctorDepartment}</span>
                  </p>
                  <p>
                    Gender: <span>{element.gender}</span>
                  </p>
                  <div style={{
                      display: "flex",
                      flexDirection: "row", 
                      gap: "10px",
                      marginTop: "10px",
                      justifyContent: "flex-center",
                      alignItems: "center", 
                    }}>
                    <button
                      style={{
                        background: "#6366f1",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px 15px",
                        cursor: "pointer",
                        width: "200px",
                      }}
                      onClick={() => handleUpdate(element)}
                    >
                      Update
                    </button>
                    <button
                      style={{
                        background: "#dc2626",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px 15px",
                        cursor: "pointer",
                        width: "200px",
                      }}
                      onClick={() => handleDelete(element._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Doctors;
