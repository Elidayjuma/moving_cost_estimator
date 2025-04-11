import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Logos from "@/components/Logos";
import Benefits from "@/components/Benefits/Benefits";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import FeatureCards from "@/components/FeaturedCards";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteDetails } from '@/data/siteDetails';
import Script from "next/script";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <FeatureCards />
      <Container>

        <FAQ />

        <CTA />
      </Container>
      <Script defer data-domain="movecalculator.tosomewherelogistics.africa" src="https://analytics.elidayjuma.com/js/script.outbound-links.js" />
      <Footer />
    </>
  );
};

export default HomePage;
