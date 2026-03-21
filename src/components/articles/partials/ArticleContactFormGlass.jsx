import "./ArticleContactFormGlass.scss"
import React, {useState} from 'react'
import { Parallax } from 'react-next-parallax'
import { useLanguage } from "/src/providers/LanguageProvider.jsx"
import StandardButton from "/src/components/buttons/StandardButton.jsx"

export default function ArticleContactFormGlass({ name, setName, email, setEmail, message, setMessage }) {
    const language = useLanguage()

    return (
        <Parallax
            className="contact-glass-parallax-wrapper"
            borderRadius="16px"
            overflowHiddenEnable={false}
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            spotGlareEnable={false}
            lineGlareEnable={false}
        >
            <div className="contact-glass-container">
                <h2 className="contact-glass-title">
                    {language.getString("send_message_title") || "SEND ME A MESSAGE"}
                </h2>

                <div className="contact-glass-form-group">
                    <i className="fa-solid fa-user contact-glass-icon"></i>
                    <input 
                        type="text" 
                        className="contact-glass-input" 
                        placeholder={language.getString("name_placeholder") || "Your Name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="contact-glass-form-group">
                    <i className="fa-solid fa-envelope contact-glass-icon"></i>
                    <input 
                        type="email" 
                        className="contact-glass-input" 
                        placeholder={language.getString("email_placeholder") || "Email Address"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="contact-glass-form-group-textarea">
                    <textarea 
                        className="contact-glass-input" 
                        placeholder={language.getString("message_placeholder") || "Message"}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        required
                    />
                </div>

                <div className="contact-glass-submit-wrapper">
                    <StandardButton 
                        type="submit"
                        variant="primary"
                        faIcon="fa-solid fa-paper-plane"
                        label={language.getString("send_message") || "SEND MESSAGE"}
                        className="contact-glass-submit-btn"
                    />
                </div>
            </div>
        </Parallax>
    )
}
