import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Button from "../../components/Button/Button";
import Footer from "../../components/footer/Footer";
import styles from "./Contact.module.css";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>

          <div className={styles.layout}>
            <form className={styles.form} onSubmit={handleSubmit}>
              {submitted ? (
                <p className={styles.success}>
                  Thank you for your message! We&apos;ll get back to you soon.
                </p>
              ) : (
                <>
                  <input
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <input
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={styles.textarea}
                  />
                  <Button type="submit" variant="primary" size="lg">
                    Send Message
                  </Button>
                </>
              )}
            </form>

            <div className={styles.info}>
              <div className={styles.infoItem}>
                <Mail size={20} />
                <div>
                  <h3>Email</h3>
                  <p>hello@Babybooocloset.com</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Phone size={20} />
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <MapPin size={20} />
                <div>
                  <h3>Address</h3>
                  <p>
                    123 Baby Lane
                    <br />
                    Portland, OR 97201
                  </p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Clock size={20} />
                <div>
                  <h3>Hours</h3>
                  <p>
                    Mon – Fri: 9am – 6pm EST
                    <br />
                    Sat: 10am – 4pm EST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
