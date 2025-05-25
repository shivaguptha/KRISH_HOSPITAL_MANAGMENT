import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [openDetails, setOpenDetails] = useState({});
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "https://h-hico.onrender.com/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://h-hico.onrender.com/api/v1/message/delete/${id}`,
        { withCredentials: true }
      );
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      toast.success("Message deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message.");
    }
  };

  // Toggle details on click or hover
  const handleToggleDetails = (id, show) => {
    setOpenDetails((prev) => ({
      ...prev,
      [id]: show !== undefined ? show : !prev[id],
    }));
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <h1>MESSAGE</h1>
      <div className="banner">
        {messages && messages.length > 0 ? (
          messages.map((element) => {
            const showDetails = !!openDetails[element._id];
            return (
              <div className="card" key={element._id}>
                <div className="details">
                  <p>
                    <span>{element.message}</span>
                  </p>
                  {showDetails && (
                    <>
                      <p>
                        First Name: <span>{element.firstName}</span>
                      </p>
                       <p>
                        Last Name: <span>{element.lastName}</span>
                      </p>
                      <p>
                        Email: <span>{element.email}</span>
                      </p>
                      <p>
                        Phone: <span>{element.phone}</span>
                      </p>
                      
                    </>
                  )}
                  <div   style={{
                      display: "flex",
                      flexDirection: "row", 
                      gap: "10px",
                      marginTop: "10px",
                      justifyContent: "flex-start",
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
                        width: "120px",
                      }}
                      onClick={() => handleToggleDetails(element._id)}

                    >
                      {showDetails ? "Hide Details" : "Show Details"}
                    </button>
                    <button
                      style={{
                        background: "#dc2626",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px 15px",
                        cursor: "pointer",
                        width: "120px",
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
          <h1>No Messages!</h1>
        )}
      </div>
    </section>
  );
};

export default Messages;
