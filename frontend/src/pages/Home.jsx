import React from "react" 
import Hero from "../components/Hero"
import Biography from "../components/Biography"
import Departments from "../components/Departments"

const Home = () => {
  return (
    <>
    <Departments/>
    <Hero title={"Lorem"} imageUrl={"/hero.png"} para={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }/>
    <Biography imageUrl={"/about.png"}/>
    <Hero title={"Services"} imageUrl={"/hero.png"} para={
          "you can Text Us, Our Contact information, Appointment Booking, and more."
        }/>
    


    </>
  );
}

export default Home;