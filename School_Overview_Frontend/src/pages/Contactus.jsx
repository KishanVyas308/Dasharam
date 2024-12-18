import React from 'react'
import ContactDetails from '../components/Contact/ContactSection'
import ContactForm from '../components/Contact/ContactForm'
import FAQSection from '../components/Contact/FAQSection'
import ContactHero from '../components/Contact/ContactHero'
const Contactus = () => {
  return (
    <div>
      <ContactHero/>
      <ContactDetails/>
     
      <FAQSection/>
      {/* <ContactForm/> */}
    </div>
  )
}

export default Contactus
