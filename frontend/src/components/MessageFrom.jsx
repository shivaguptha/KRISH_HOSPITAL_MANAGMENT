import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "https://h-hico.onrender.com/api/v1/message/send",
          { firstName, lastName, email, phone, message },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setMessage("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
          <div style={{ display: "flex", backgroundColor:"#1a1a1a",flexDirection: "column",marginLeft: "auto", marginRight: "auto", alignItems: "center",marginBottom: "100px",boxShadow: "0 0 30px rgb(255, 255, 255)", padding: "20px",width:"400px"}}>
            <h4>Contact Details</h4>
            <br />
            <div className="contact-details">
              <FaPhone />
              <span>+91-9618148039</span>
            </div>
            <br />
            <div className="contact-details">
              <MdEmail />
              <span>krishHelp@gmail.com</span>
            </div>
            <br />
            <div className="contact-details">
              <FaLocationArrow />
              <span>Guwahati | Assam</span>
            </div>
           
          </div>

      <div className="container form-component message-form"
      style={{width: "800px", display: "flex", justifyContent: "space-between",
        alignItems: "center", flexDirection: "column", marginTop: "10px", marginBottom: "50px",
         boxShadow: "0 0 30px rgb(255, 255, 255)", gap: "20px",paddingTop:"50px",paddingBottom: "40px",
        marginLeft: "auto", marginRight: "auto" ,height: "600px"
        }}
      >


        <h2>Send Us A Message</h2>
        <form onSubmit={handleMessage}>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <textarea
            rows={5}
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div style={{ justifyContent: "center", alignItems: "center",marginTop: "20px" }}>
            <button type="submit">Send</button>
          </div>
        </form>
        <img src="/Vector.png" alt="vector" />
        
        
      </div>
    </>
  );
};

export default MessageForm;
