import React from "react";
import "../../style/about.css";


const About = () => {
  return (
    <>
     

      <section className="about-page">
        <div className="about-container">

          <div className="about-left">
            <h1>About Fragranzia</h1>

            <p className="breadcrumb">
              Home <span>&gt;</span> About
            </p>

            <p>
              At Fragranzia, we believe that a perfume is more than just a
              scent—it is a story, an emotion, and a timeless memory. Our
              carefully selected fragrances are crafted to enhance every
              personality and every occasion.
            </p>

            <p>
              Guided by passion and precision, we source premium ingredients
              from around the world to create luxurious fragrances that inspire
              confidence and elegance.
            </p>

            <p>
              Every bottle is designed with care, blending tradition with modern
              craftsmanship to deliver an unforgettable sensory experience.
            </p>

            <p>
              Whether you're searching for your signature scent or the perfect
              gift, Fragranzia is here to make every moment memorable.
            </p>
          </div>

          <div className="about-right">
            <img src="/girlperfume.jpg" alt="Perfume" className="top-img" />
            <img src="/about2.jpg" alt="Fragrance" className="bottom-img" />
          </div>

        </div>
      </section>

     
    </>
  );
};

export default About;