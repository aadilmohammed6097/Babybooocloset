import Hero from "../../components/Hero/Hero";
import Collections from "../../components/Collections/Collections";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import Footer from "../../components/footer/Footer";
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

const Home = () => {
  useEffect(() => {
    console.log("Supabase Client:", supabase);
  }, []);
  return (
    <>
      <Hero />
      <Collections />
      <FeaturedProducts />
      <NewArrivals />
      <Footer />
    </>
  );
};

export default Home;
